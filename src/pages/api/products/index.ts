import type { APIRoute } from 'astro';
import { getDb, products, productImages } from '../../../db';
import { desc } from 'drizzle-orm';
import type { Env } from '../../../types';

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime?.env as Env;
  if (!env?.DB) {
    return new Response(JSON.stringify({ error: 'DB no configurada' }), { status: 500 });
  }

  const db = getDb(env.DB);
  const url = new URL(context.request.url);

  const category = url.searchParams.get('category');
  const gender = url.searchParams.get('gender');
  const weekly = url.searchParams.get('weekly');
  const query = url.searchParams.get('q');

  try {
    const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));

    let filtered = allProducts;

    if (category && category !== 'todos') {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (gender && gender !== 'todos') {
      filtered = filtered.filter((p) => p.gender.toLowerCase() === gender.toLowerCase());
    }
    if (weekly === 'true') {
      filtered = filtered.filter((p) => p.isWeeklyFeature);
    }
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.modelCode && p.modelCode.toLowerCase().includes(q))
      );
    }

    // Cargar imágenes primarias para cada producto
    const allImages = await db.select().from(productImages);
    const productsWithImages = filtered.map((prod) => {
      const images = allImages
        .filter((img) => img.productId === prod.id)
        .sort((a, b) => a.orderIndex - b.orderIndex);
      return {
        ...prod,
        images: images.map((i) => i.imageUrl),
        primaryImage: images.find((i) => i.isPrimary)?.imageUrl || images[0]?.imageUrl || null,
      };
    });

    return new Response(JSON.stringify({ products: productsWithImages }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const POST: APIRoute = async (context) => {
  const user = context.locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  }

  const env = context.locals.runtime?.env as Env;
  if (!env?.DB) {
    return new Response(JSON.stringify({ error: 'DB no configurada' }), { status: 500 });
  }

  try {
    const body = (await context.request.json()) as any;
    const {
      name,
      brand,
      modelCode,
      category,
      gender = 'unisex',
      frameMaterial,
      frameShape,
      color,
      dimensions,
      price,
      priceOnRequest = false,
      status = 'in_stock',
      description,
      isWeeklyFeature = false,
      images = [],
    } = body;

    if (!name || !brand || !category || !color) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios: Nombre, Marca, Categoría y Color.' }),
        { status: 400 }
      );
    }

    const db = getDb(env.DB);
    const productId = 'prod_' + crypto.randomUUID().slice(0, 12);
    const nowStr = new Date().toISOString();

    await db.insert(products).values({
      id: productId,
      name,
      brand,
      modelCode: modelCode || null,
      category,
      gender,
      frameMaterial: frameMaterial || null,
      frameShape: frameShape || null,
      color,
      dimensions: dimensions || null,
      price: price ? Number(price) : null,
      priceOnRequest: Boolean(priceOnRequest),
      status,
      description: description || null,
      isWeeklyFeature: Boolean(isWeeklyFeature),
      featuredAt: isWeeklyFeature ? nowStr : null,
      createdAt: nowStr,
      updatedAt: nowStr,
    });

    // Insertar imágenes asociadas
    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await db.insert(productImages).values({
          id: 'img_' + crypto.randomUUID().slice(0, 12),
          productId,
          imageUrl: images[i],
          isPrimary: i === 0,
          orderIndex: i,
          createdAt: nowStr,
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, productId, message: 'Lente creado exitosamente' }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error al guardar el producto' }), {
      status: 500,
    });
  }
};
