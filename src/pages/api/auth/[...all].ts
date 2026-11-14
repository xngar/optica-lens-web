import type { APIRoute } from 'astro';
import { createAuth } from '../../../lib/auth';
import type { Env } from '../../../types';

export const ALL: APIRoute = async (context) => {
  const env = context.locals.runtime?.env as Env;
  if (!env?.DB) {
    return new Response(JSON.stringify({ error: 'DB binding missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const auth = createAuth(env, context.url.origin);
  return auth.handler(context.request);
};
