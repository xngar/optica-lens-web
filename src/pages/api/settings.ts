import type { APIRoute } from 'astro';
import { getDb, siteSettings } from '../../db';
import type { Env } from '../../types';

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime?.env as Env;
  if (!env?.DB) {
    return new Response(JSON.stringify({ error: 'DB no configurada' }), { status: 500 });
  }

  try {
    const db = getDb(env.DB);
    const settings = await db.select().from(siteSettings);
    const configMap: Record<string, string> = {};
    settings.forEach((s) => {
      configMap[s.key] = s.value;
    });

    return new Response(JSON.stringify({ settings: configMap }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const PUT: APIRoute = async (context) => {
  const currentUser = context.locals.user;
  if (!currentUser || currentUser.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Solo el administrador puede cambiar las configuraciones' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const env = context.locals.runtime?.env as Env;
  if (!env?.DB) {
    return new Response(JSON.stringify({ error: 'DB no configurada' }), { status: 500 });
  }

  try {
    const body = (await context.request.json()) as Record<string, any>;
    const db = getDb(env.DB);

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        await db
          .insert(siteSettings)
          .values({ key, value })
          .onConflictDoUpdate({
            target: siteSettings.key,
            set: { value },
          });
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Configuraciones guardadas' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
