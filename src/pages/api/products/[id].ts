import type { APIRoute } from 'astro';
import { getDb, products, productImages } from '../../../db';
import { eq } from 'drizzle-orm';
import type { Env } from '../../../types';

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime?.env as Env;
  const id = context.params.id;

  if (!id || !env?.DB) {
    return new Response(JSON.stringify({ error: 'Producto no encontrado' }), { status: 404 });
  }

  const db = getDb(env.DB);
  const found = await db.select().from(products).where(eq(products.id, id));

  if (found.length === 0) {
    return new Response(JSON.stringify({ error: 'Producto no encontrado' }), { status: 404 });
  }

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, id));

  return new Response(
    JSON.stringify({
      product: {
        ...found[0],
        images: images.sort((a, b) => a.orderIndex - b.orderIndex).map((img) => img.imageUrl),
      },
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};

export const PUT: APIRoute = async (context) => {
  const user = context.locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  }

  const env = context.locals.runtime?.env as Env;
  const id = context.params.id;
  if (!id || !env?.DB) {
    return new Response(JSON.stringify({ error: 'ID o BD no válida' }), { status: 400 });
  }

  try {
    const body = (await context.request.json()) as any;
    const {
      name,
      brand,
      modelCode,
      category,
      gender,
      frameMaterial,
      frameShape,
      color,
      dimensions,
      price,
      priceOnRequest,
      status,
      description,
      isWeeklyFeature,
      images = [],
    } = body;

    const db = getDb(env.DB);
    const nowStr = new Date().toISOString();

    await db
      .update(products)
      .set({
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
        updatedAt: nowStr,
      })
      .where(eq(products.id, id));

    // Si se enviaron nuevas imágenes, reemplazar las existentes
    if (Array.isArray(images) && images.length > 0) {
      await db.delete(productImages).where(eq(productImages.productId, id));
      for (let i = 0; i < images.length; i++) {
        await db.insert(productImages).values({
          id: 'img_' + crypto.randomUUID().slice(0, 12),
          productId: id,
          imageUrl: images[i],
          isPrimary: i === 0,
          orderIndex: i,
          createdAt: nowStr,
        });
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Producto actualizado' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async (context) => {
  const user = context.locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  }

  // Tanto admin como staff pueden eliminar productos (según acuerdo Q2)
  const env = context.locals.runtime?.env as Env;
  const id = context.params.id;
  if (!id || !env?.DB) {
    return new Response(JSON.stringify({ error: 'ID o BD no válida' }), { status: 400 });
  }

  try {
    const db = getDb(env.DB);
    // Eliminar imágenes asociadas
    await db.delete(productImages).where(eq(productImages.productId, id));
    // Eliminar producto
    await db.delete(products).where(eq(products.id, id));

    return new Response(JSON.stringify({ success: true, message: 'Producto eliminado correctamente' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
