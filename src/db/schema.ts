import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// --- Better Auth Schema with Roles ---
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('staff'), // 'admin' | 'staff'
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refreshTokenExpiresAt', { mode: 'timestamp' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }),
});

// --- Catálogo de Lentes / Fichas de Productos ---
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  brand: text('brand').notNull(),
  modelCode: text('model_code'),
  category: text('category').notNull(), // 'opticos' | 'sol' | 'filtro-azul' | 'lectura' | 'infantil'
  gender: text('gender').notNull().default('unisex'), // 'hombre' | 'mujer' | 'unisex' | 'infantil'
  frameMaterial: text('frame_material'), // 'acetato' | 'metal' | 'titanio' | 'tr90' | 'mixto' | 'otro'
  frameShape: text('frame_shape'), // 'cuadrado' | 'redondo' | 'aviador' | 'cat-eye' | 'rectangular' | 'otro'
  color: text('color').notNull(),
  dimensions: text('dimensions'), // ej: "52-18-140"
  price: integer('price'), // Precio en valor entero
  priceOnRequest: integer('price_on_request', { mode: 'boolean' }).notNull().default(false),
  status: text('status').notNull().default('in_stock'), // 'in_stock' | 'out_of_stock' | 'preorder'
  description: text('description'),
  isWeeklyFeature: integer('is_weekly_feature', { mode: 'boolean' }).notNull().default(false),
  featuredAt: text('featured_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const productImages = sqliteTable('product_images', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

export const siteSettings = sqliteTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export const uploadedImages = sqliteTable('uploaded_images', {
  id: text('id').primaryKey(),
  fileName: text('file_name').notNull(),
  contentType: text('content_type').notNull().default('image/webp'),
  base64Data: text('base64_data').notNull(),
  size: integer('size').notNull(),
  createdAt: text('created_at').notNull(),
});
