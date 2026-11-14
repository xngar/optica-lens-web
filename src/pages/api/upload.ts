import type { APIRoute } from 'astro';
import { getDb, uploadedImages } from '../../db';
import type { Env } from '../../types';

export const POST: APIRoute = async (context) => {
  const user = context.locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado. Debes iniciar sesión.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const env = context.locals.runtime?.env as Env;
  if (!env?.DB) {
    return new Response(JSON.stringify({ error: 'Base de datos D1 no disponible.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await context.request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      const singleFile = formData.get('file') as File;
      if (singleFile) files.push(singleFile);
    }

    if (files.length === 0) {
      return new Response(JSON.stringify({ error: 'No se enviaron archivos para subir.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = getDb(env.DB);
    const uploadedUrls: string[] = [];
    const nowStr = new Date().toISOString();

    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const base64Data = Buffer.from(buffer).toString('base64');
      const randomId = crypto.randomUUID().slice(0, 8);
      const imageId = `img_${Date.now()}_${randomId}`;

      await db.insert(uploadedImages).values({
        id: imageId,
        fileName: file.name,
        contentType: file.type || 'image/webp',
        base64Data,
        size: buffer.byteLength,
        createdAt: nowStr,
      });

      const publicUrl = `/api/images/${imageId}`;
      uploadedUrls.push(publicUrl);
    }

    return new Response(
      JSON.stringify({
        success: true,
        urls: uploadedUrls,
        url: uploadedUrls[0],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Error al procesar la subida' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
