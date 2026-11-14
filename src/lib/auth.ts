import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDb } from '../db';
import * as schema from '../db/schema';
import type { Env } from '../types';

export function createAuth(env: Env, requestOrigin?: string) {
  const db = getDb(env.DB);
  const resolvedBaseUrl = requestOrigin || env.BETTER_AUTH_URL || 'http://localhost:4321';

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    secret: env.BETTER_AUTH_SECRET || 'optica_secret_change_in_production_min_32_characters',
    baseURL: resolvedBaseUrl,
    trustedOrigins: [resolvedBaseUrl, 'http://localhost:4321'],
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
    },
    user: {
      additionalFields: {
        role: {
          type: 'string',
          defaultValue: 'staff',
          input: false,
        },
      },
    },
  });
}

export type AuthInstance = ReturnType<typeof createAuth>;
