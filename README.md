# 👓 Óptica Visión - Web, Catálogo y Panel de Administración

Sitio web y catálogo profesional para óptica desarrollado con **Astro 5 (SSR)**, diseñado específicamente para desplegarse en la **capa 100% gratuita de Cloudflare** utilizando **Cloudflare D1 (SQLite)**, **Cloudflare R2** para almacenamiento de imágenes, autenticación con **Better Auth** con roles, **Drizzle ORM** y **Tailwind CSS v4**.

---

## 🚀 Tecnologías y Arquitectura

* **Framework**: Astro 5 en modo Server-Side Rendering (`output: 'server'`).
* **Hosting & Edge**: Cloudflare Pages / Workers con el adaptador oficial `@astrojs/cloudflare`.
* **Base de Datos**: Cloudflare D1 (SQLite distribuido en el Edge, 5 GB gratis).
* **Almacenamiento de Fotos**: Almacenamiento directo optimizado en **Cloudflare D1** en formato WebP con endpoint de entrega en caché. **No requiere tarjeta de crédito ni servicios externos**.
* **Autenticación**: Better Auth con adaptador Drizzle SQLite.
* **Control de Acceso (RBAC)**:
  * **Administrador (`admin`)**: Control total, CRUD de catálogo, gestión y alta de personal/cuentas, configuraciones de óptica.
  * **Personal de Óptica (`staff`)**: Carga de fotos, creación, edición y eliminación de fichas de lentes. Sin acceso a gestión de usuarios ni ajustes críticos.
* **Optimización WebP**: Compresión automática en el navegador antes de subir las fotos a R2 (reduce archivos de 8MB a ~180KB en formato WebP).
* **Ficha Técnica & WhatsApp**: Generación automática de enlace directo a WhatsApp con modelo, marca y enlace de la ficha prellenado.
* **Estilos**: Tailwind CSS v4.

---

## 🔑 Credenciales Iniciales de Prueba

El script de inicialización genera dos cuentas de prueba listas para usar:

| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@optica.com` | `Admin123!` | Total + Usuarios + Catálogo + Ajustes |
| **Personal** | `staff@optica.com` | `Staff123!` | Subir, editar y eliminar lentes del catálogo |

---

## 💻 Desarrollo Local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Inicializar Base de Datos Local (Migración y Seed con datos de muestra)
```bash
npm run db:setup:local
```

### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```

La web estará disponible en:
* **Página Pública**: [http://localhost:4321](http://localhost:4321)
* **Catálogo de Lentes**: [http://localhost:4321/catalogo](http://localhost:4321/catalogo)
* **Panel de Control**: [http://localhost:4321/admin](http://localhost:4321/admin)
* **Inicio de Sesión**: [http://localhost:4321/admin/login](http://localhost:4321/admin/login)

---

## ☁️ Guía de Despliegue en Cloudflare (Capa Gratuita \$0)

Sigue estos sencillos pasos para publicar tu sitio en producción:

### Paso 1: Iniciar sesión en Cloudflare desde tu terminal
```bash
npx wrangler login
```

### Paso 2: Crear la Base de Datos D1 en tu cuenta de Cloudflare
```bash
npx wrangler d1 create optica-db
```
El comando te devolverá un `database_id`. Ya está configurado en `wrangler.jsonc`.

### Paso 3: Aplicar migraciones y datos iniciales en producción
```bash
# 1. Aplicar las tablas en Cloudflare D1 Remoto (incluyendo tabla de fotos y usuarios)
npm run db:migrate:remote

# 2. Crear las cuentas de Administrador, Personal y lentes de muestra
npm run db:seed:remote
```

### Paso 4: Desplegar el proyecto
```bash
npm run build
npx wrangler deploy
```

¡Listo! Cloudflare te entregará una URL pública gratuita (ej. `https://optica-lens-web.pages.dev` o `workers.dev`), con certificado SSL HTTPS automático.

---

## 📂 Estructura del Proyecto

```text
optica-lens-web/
├── drizzle/
│   └── migrations/              # Migraciones SQL generadas para Cloudflare D1
├── scripts/
│   └── seed.mjs                 # Script para crear admin, staff y catálogo demo
├── src/
│   ├── db/
│   │   ├── index.ts             # Cliente Drizzle ORM sobre Cloudflare D1
│   │   └── schema.ts            # Esquemas de usuarios, sesiones, lentes y fotos
│   ├── layouts/
│   │   ├── Layout.astro         # Layout público (cabecera, footer, botón WhatsApp)
│   │   └── AdminLayout.astro    # Layout del panel privado con roles y logout
│   ├── lib/
│   │   ├── auth.ts              # Servidor Better Auth (Email & Password + Roles)
│   │   ├── auth-client.ts       # Cliente Better Auth en navegador
│   │   └── image-optimizer.ts   # Compresor en cliente a WebP antes de Cloudflare R2
│   ├── pages/
│   │   ├── index.astro          # Portada con Novedades de la Semana
│   │   ├── catalogo.astro       # Catálogo con buscador y filtros por categoría/género
│   │   ├── lentes/
│   │   │   └── [id].astro       # Ficha técnica detallada + WhatsApp prellenado
│   │   ├── admin/
│   │   │   ├── index.astro      # Listado y métricas de productos
│   │   │   ├── login.astro      # Formulario de inicio de sesión seguro
│   │   │   ├── settings.astro   # Configuración de teléfono, horarios y dirección
│   │   │   ├── products/
│   │   │   │   ├── new.astro    # Formulario de carga con optimizador WebP
│   │   │   │   └── edit/[id].astro # Edición de armazones existentes
│   │   │   └── users/
│   │   │       └── index.astro  # Gestión de personal (exclusivo Administrador)
│   │   └── api/
│   │       ├── auth/[...all].ts # Endpoints de Better Auth
│   │       ├── upload.ts        # Endpoint que guarda en Cloudflare R2
│   │       ├── images/[...key].ts # Servidor de imágenes con caché optimizada
│   │       ├── products/        # Endpoints CRUD de lentes
│   │       ├── users/           # Endpoints de creación y borrado de personal
│   │       └── settings.ts      # Endpoint de ajustes de la óptica
│   ├── middleware.ts            # Protección de rutas /admin y control RBAC
│   └── types.ts                 # Tipos TypeScript y bindings de Cloudflare
├── astro.config.mjs             # Configuración Astro SSR + Cloudflare Adapter
├── drizzle.config.ts            # Configuración de Drizzle Kit
├── package.json
└── wrangler.jsonc               # Bindings de Cloudflare D1 y R2
```
