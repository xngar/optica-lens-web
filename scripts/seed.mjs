import { hashPassword } from 'better-auth/crypto';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function seed() {
  const isRemote = process.argv.includes('--remote');
  const targetFlag = isRemote ? '--remote' : '--local';
  console.log(`Iniciando seed en modo: ${isRemote ? 'PRODUCCIÓN (Remote)' : 'DESARROLLO (Local)'}...`);

  const now = Date.now();
  const dateStr = new Date().toISOString();

  // Hashear contraseñas
  const adminPasswordHash = await hashPassword('Admin123!');
  const staffPasswordHash = await hashPassword('Staff123!');

  const sqlStatements = [
    // 1. Limpiar o insertar configuraciones
    `INSERT OR REPLACE INTO site_settings (key, value) VALUES ('whatsapp_number', '+56912345678');`,
    `INSERT OR REPLACE INTO site_settings (key, value) VALUES ('optical_name', 'Óptica Visión Moderna');`,
    `INSERT OR REPLACE INTO site_settings (key, value) VALUES ('address', 'Av. Providencia 1234, Providencia, Santiago');`,
    `INSERT OR REPLACE INTO site_settings (key, value) VALUES ('business_hours', 'Lunes a Viernes 09:30 - 19:30 hrs | Sábados 10:00 - 14:00 hrs');`,

    // 2. Administrador Inicial
    `INSERT OR REPLACE INTO user (id, name, email, emailVerified, role, createdAt, updatedAt)
     VALUES ('user_admin_01', 'Administrador General', 'admin@optica.com', 1, 'admin', ${now}, ${now});`,
    `INSERT OR REPLACE INTO account (id, accountId, providerId, userId, password, createdAt, updatedAt)
     VALUES ('acc_admin_01', 'user_admin_01', 'credential', 'user_admin_01', '${adminPasswordHash}', ${now}, ${now});`,

    // 3. Personal Inicial
    `INSERT OR REPLACE INTO user (id, name, email, emailVerified, role, createdAt, updatedAt)
     VALUES ('user_staff_01', 'Personal de Óptica', 'staff@optica.com', 1, 'staff', ${now}, ${now});`,
    `INSERT OR REPLACE INTO account (id, accountId, providerId, userId, password, createdAt, updatedAt)
     VALUES ('acc_staff_01', 'user_staff_01', 'credential', 'user_staff_01', '${staffPasswordHash}', ${now}, ${now});`,

    // 4. Lentes de muestra (Novedades de la semana y catálogo)
    `INSERT OR REPLACE INTO products (
      id, name, brand, model_code, category, gender, frame_material, frame_shape, color, dimensions, price, price_on_request, status, description, is_weekly_feature, featured_at, created_at, updated_at
    ) VALUES (
      'prod_01',
      'Aviator Classic Polarized',
      'Ray-Ban',
      'RB3025-001/58',
      'sol',
      'unisex',
      'metal',
      'aviador',
      'Dorado / Lentes Verde G-15',
      '58-14-135',
      159990,
      0,
      'in_stock',
      'El modelo icónico diseñado originalmente para aviadores militares en 1937. Marco metálico ligero y protección UV 400 total.',
      1,
      '${dateStr}',
      '${dateStr}',
      '${dateStr}'
    );`,
    `INSERT OR REPLACE INTO product_images (id, product_id, image_url, is_primary, order_index, created_at)
     VALUES ('img_01_1', 'prod_01', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', 1, 0, '${dateStr}');`,
    `INSERT OR REPLACE INTO product_images (id, product_id, image_url, is_primary, order_index, created_at)
     VALUES ('img_01_2', 'prod_01', 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80', 0, 1, '${dateStr}');`,

    `INSERT OR REPLACE INTO products (
      id, name, brand, model_code, category, gender, frame_material, frame_shape, color, dimensions, price, price_on_request, status, description, is_weekly_feature, featured_at, created_at, updated_at
    ) VALUES (
      'prod_02',
      'Holbrook Matte Black Prizm',
      'Oakley',
      'OO9102-E855',
      'sol',
      'hombre',
      'tr90',
      'cuadrado',
      'Negro Mate / Lente Zafiro Iridium',
      '57-18-137',
      139990,
      0,
      'in_stock',
      'Diseño clásico e intemporal fusionado con tecnología moderna Oakley. Remaches metálicos e iconos de la marca.',
      1,
      '${dateStr}',
      '${dateStr}',
      '${dateStr}'
    );`,
    `INSERT OR REPLACE INTO product_images (id, product_id, image_url, is_primary, order_index, created_at)
     VALUES ('img_02_1', 'prod_02', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80', 1, 0, '${dateStr}');`,

    `INSERT OR REPLACE INTO products (
      id, name, brand, model_code, category, gender, frame_material, frame_shape, color, dimensions, price, price_on_request, status, description, is_weekly_feature, featured_at, created_at, updated_at
    ) VALUES (
      'prod_03',
      'Armazón Ultralight Titanium Elegance',
      'Silhouette',
      'TMA-5515',
      'opticos',
      'unisex',
      'titanio',
      'redondo',
      'Gris Grafito Satinado',
      '50-19-145',
      199990,
      0,
      'in_stock',
      'Fabricado en titanio de alta pureza. Peso inferior a 12 gramos para máxima comodidad durante todo el día.',
      1,
      '${dateStr}',
      '${dateStr}',
      '${dateStr}'
    );`,
    `INSERT OR REPLACE INTO product_images (id, product_id, image_url, is_primary, order_index, created_at)
     VALUES ('img_03_1', 'prod_03', 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80', 1, 0, '${dateStr}');`,

    `INSERT OR REPLACE INTO products (
      id, name, brand, model_code, category, gender, frame_material, frame_shape, color, dimensions, price, price_on_request, status, description, is_weekly_feature, featured_at, created_at, updated_at
    ) VALUES (
      'prod_04',
      'Filtro Luz Azul BlueShield Cat-Eye',
      'OptiVision',
      'OV-BLUE-2024',
      'filtro-azul',
      'mujer',
      'acetato',
      'cat-eye',
      'Carey Habana con detalles dorados',
      '52-17-140',
      54990,
      0,
      'in_stock',
      'Cristales orgánicos con tratamiento antirreflejo y filtro de luz azul para trabajo prolongado frente a pantallas.',
      0,
      NULL,
      '${dateStr}',
      '${dateStr}'
    );`,
    `INSERT OR REPLACE INTO product_images (id, product_id, image_url, is_primary, order_index, created_at)
     VALUES ('img_04_1', 'prod_04', 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80', 1, 0, '${dateStr}');`,

    `INSERT OR REPLACE INTO products (
      id, name, brand, model_code, category, gender, frame_material, frame_shape, color, dimensions, price, price_on_request, status, description, is_weekly_feature, featured_at, created_at, updated_at
    ) VALUES (
      'prod_05',
      'Armazón Flexible Indestructible Kids',
      'Nano Vista',
      'NV-KID-44',
      'infantil',
      'infantil',
      'tr90',
      'rectangular',
      'Azul Marino con Varillas Naranjas',
      '44-16-125',
      69990,
      0,
      'in_stock',
      'Armazón fabricado en Siliflex patentado. Prácticamente irrompible, incluye banda elástica intercambiable.',
      0,
      NULL,
      '${dateStr}',
      '${dateStr}'
    );`,
    `INSERT OR REPLACE INTO product_images (id, product_id, image_url, is_primary, order_index, created_at)
     VALUES ('img_05_1', 'prod_05', 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80', 1, 0, '${dateStr}');`
  ];

  const tempSqlFile = path.resolve('./temp_seed.sql');
  fs.writeFileSync(tempSqlFile, sqlStatements.join('\n\n'), 'utf-8');

  try {
    const cmd = `npx wrangler d1 execute optica-db ${targetFlag} --file=${tempSqlFile}`;
    console.log(`Ejecutando: ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
    console.log('✅ Base de datos inicializada exitosamente con usuarios y productos de prueba!');
    console.log('--- Credenciales de Acceso Creadas ---');
    console.log('👤 Administrador: admin@optica.com | Contraseña: Admin123!');
    console.log('👓 Personal: staff@optica.com | Contraseña: Staff123!');
  } finally {
    if (fs.existsSync(tempSqlFile)) {
      fs.unlinkSync(tempSqlFile);
    }
  }
}

seed().catch((err) => {
  console.error('Error durante el seed:', err);
  process.exit(1);
});
