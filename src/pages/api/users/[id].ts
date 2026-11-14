import type { APIRoute } from 'astro';
import { getDb, user as userTable, account as accountTable, session as sessionTable } from '../../../db';
import { eq } from 'drizzle-orm';
import type { Env } from '../../../types';

export const DELETE: APIRoute = async (context) => {
  const currentUser = context.locals.user;
  if (!currentUser || currentUser.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Acceso denegado. Solo administradores.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const id = context.params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID inválido' }), { status: 400 });
  }

  if (id === currentUser.id) {
    return new Response(JSON.stringify({ error: 'No puedes eliminar tu propia cuenta de administrador.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const env = context.locals.runtime?.env as Env;
  if (!env?.DB) {
    return new Response(JSON.stringify({ error: 'DB no configurada' }), { status: 500 });
  }

  try {
    const db = getDb(env.DB);
    // Eliminar sesiones y cuentas asociadas
    await db.delete(sessionTable).where(eq(sessionTable.userId, id));
    await db.delete(accountTable).where(eq(accountTable.userId, id));
    await db.delete(userTable).where(eq(userTable.id, id));

    return new Response(JSON.stringify({ success: true, message: 'Usuario eliminado correctamente' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
