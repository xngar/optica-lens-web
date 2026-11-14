import { defineMiddleware } from 'astro:middleware';
import { createAuth } from './lib/auth';
import type { Env, AppUser } from './types';

declare global {
  namespace App {
    interface Locals {
      user: AppUser | null;
      session: any | null;
      runtime: {
        env: Env;
      };
    }
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  const env = context.locals.runtime?.env as Env;
  const pathname = context.url.pathname;

  if (!env?.DB) {
    return next();
  }

  const auth = createAuth(env, context.url.origin);

  try {
    const sessionData = await auth.api.getSession({
      headers: context.request.headers,
    });

    if (sessionData) {
      context.locals.user = sessionData.user as AppUser;
      context.locals.session = sessionData.session;
    } else {
      context.locals.user = null;
      context.locals.session = null;
    }
  } catch {
    context.locals.user = null;
    context.locals.session = null;
  }

  // Rutas de administración
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const isAuthenticated = !!context.locals.user;

    if (!isAuthenticated && !isLoginPage) {
      return context.redirect('/admin/login');
    }

    if (isAuthenticated && isLoginPage) {
      return context.redirect('/admin');
    }

    // Solo admin puede acceder a gestión de usuarios
    if (pathname.startsWith('/admin/users') && context.locals.user?.role !== 'admin') {
      return context.redirect('/admin?error=unauthorized');
    }
  }

  return next();
});
