import type { APIRoute } from 'astro';
import { getDb, user as userTable, account as accountTable } from '../../../db';
import { hashPassword } from 'better-auth/crypto';
import { eq, desc } from 'drizzle-orm';
import type { Env } from '../../../types';

export const GET: APIRoute = async (context) => {
  const currentUser = context.locals.user;
  if (!currentUser || currentUser.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Acceso denegado. Solo administradores.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const env = context.locals.runtime?.env as Env;
  if (!env?.DB) {
    return new Response(JSON.stringify({ error: 'DB no configurada' }), { status: 500 });
  }

  try {
    const db = getDb(env.DB);
    const users = await db
      .select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        role: userTable.role,
        createdAt: userTable.createdAt,
      })
      .from(userTable)
      .orderBy(desc(userTable.createdAt));

    return new Response(JSON.stringify({ users }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const POST: APIRoute = async (context) => {
  const currentUser = context.locals.user;
  if (!currentUser || currentUser.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Acceso denegado. Solo administradores pueden crear usuarios.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const env = context.locals.runtime?.env as Env;
  if (!env?.DB) {
    return new Response(JSON.stringify({ error: 'DB no configurada' }), { status: 500 });
  }

  try {
    const { name, email, password, role = 'staff' } = (await context.request.json()) as any;

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: 'Nombre, correo y contraseña son obligatorios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = getDb(env.DB);

    // Verificar si el correo ya existe
    const existing = await db.select().from(userTable).where(eq(userTable.email, email.toLowerCase().trim()));
    if (existing.length > 0) {
      return new Response(JSON.stringify({ error: 'Ya existe un usuario con este correo electrónico.' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newUserId = 'user_' + crypto.randomUUID().slice(0, 12);
    const newAccountId = 'acc_' + crypto.randomUUID().slice(0, 12);
    const hashedPassword = await hashPassword(password);
    const now = new Date();

    await db.insert(userTable).values({
      id: newUserId,
      name,
      email: email.toLowerCase().trim(),
      emailVerified: true,
      role: role === 'admin' ? 'admin' : 'staff',
      createdAt: now,
      updatedAt: now,
    });

    await db.insert(accountTable).values({
      id: newAccountId,
      accountId: newUserId,
      providerId: 'credential',
      userId: newUserId,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    return new Response(
      JSON.stringify({ success: true, message: `Usuario ${name} (${role}) creado exitosamente.` }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
