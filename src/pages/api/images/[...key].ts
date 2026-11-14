import type { APIRoute } from 'astro';
import { getDb, uploadedImages } from '../../../db';
import { eq } from 'drizzle-orm';
import type { Env } from '../../../types';

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime?.env as Env;
  const key = context.params.key;

  if (!key) {
    return new Response('Not Found', { status: 404 });
  }

  if (!env?.DB) {
    return new Response('Base de datos no disponible', { status: 500 });
  }

  // Extraer el identificador de la imagen
  const cleanId = key.replace(/^lenses\//, '').replace(/\.[^/.]+$/, '');

  try {
    const db = getDb(env.DB);
    const found = await db
      .select()
      .from(uploadedImages)
      .where(eq(uploadedImages.id, cleanId));

    if (found.length === 0) {
      return new Response('Imagen no encontrada', { status: 404 });
    }

    const item = found[0];
    const binary = Buffer.from(item.base64Data, 'base64');

    return new Response(binary, {
      headers: {
        'Content-Type': item.contentType || 'image/webp',
        'Content-Length': binary.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err: any) {
    return new Response('Error al recuperar imagen: ' + err.message, { status: 500 });
  }
};
