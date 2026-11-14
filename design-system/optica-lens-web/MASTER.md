# Design System Master — Óptica Visión Moderna (`optica-lens-web`)

> Generated via `ui-ux-pro-max` Design Intelligence
> **Referencias de Marca:** **Ben & Frank** (`benandfrank.cl`) + **OPV** (`opv.cl`)
> **Profile:** Modern D2C Eyewear E-Commerce (`E-commerce #3` + `Geometric Modern #11` + `Bento Grid / Block-based #6`)

---

## 1. Regla Estricta del Proyecto (`AGENTS.md`)
- **PROHIBIDO usar Badges / Etiquetas flotantes (Zero-Badges Rule):** No agregar *badges*, píldoras promocionales sobre títulos, ni etiquetas superpuestas en fotos de productos, categorías o banners a menos que el usuario lo solicite explícitamente.
- **Hero Full-Viewport (`100vw` × `100vh`):** El Hero principal utiliza fotografía publicitaria *close-up* de rostro con lentes como fondo a pantalla completa (`w-full min-h-dvh`), sin tarjetas de producto secundarias.

## 2. Dirección Visual (Estilo Ben & Frank + OPV)
- **Personalidad:** Moderna, juvenil, fresca y 100% profesional. Sin serifas antiguas ni tonos beige envejecidos.
- **Superficies Limpias:** Blanco puro (`#FFFFFF`) combinado con bloques grises fríos ultralimpios (`#F4F4F5` / `zinc-100`) que hacen resaltar el color real de los armazones sin ruido visual.
- **Contraste y Energía:** Botones y encabezados en Negro Carbón (`#09090B` / `zinc-950`) combinados con Azul Eléctrico (`#2563EB` / `blue-600`) y Verde Esmeralda (`#10B981`) para WhatsApp.
- **Tarjetas de Producto D2C:** Imagen amplia y despejada sobre contenedor luminoso, efecto `hover:-translate-y-1`, precio grande en números tabulares y acción rápida a un clic.

## 3. Tokens de Color (Tailwind v4 `@theme`)
| Token | Valor | Uso | Contraste WCAG |
|---|---|---|---|
| `--color-surface` | `#FFFFFF` (`white`) | Fondo principal limpio | Base |
| `--color-surface-muted` | `#F4F4F5` (`zinc-100`) | Fondos de tarjetas de lentes y bloques Bento | Base |
| `--color-ink` | `#09090B` (`zinc-950`) | Títulos, precios y botones primarios | 19.4:1 (AAA) |
| `--color-ink-secondary` | `#52525B` (`zinc-600`) | Textos descriptivos y subtítulos | 7.2:1 (AAA) |
| `--color-brand` | `#2563EB` (`blue-600`) | Acento moderno OPV (links activos, focos, CTAs) | 5.1:1 (AA) |
| `--color-whatsapp` | `#10B981` (`emerald-500`) | Acción directa de WhatsApp | 4.5:1+ |

## 4. Tipografía (`Geometric Modern #11`)
- **Display & Títulos (`--font-display`):** `'Outfit', sans-serif` (pesos `600`, `700`, `800`) — geométrica, juvenil y con personalidad moderna.
- **UI & Cuerpo (`--font-sans`):** `'Plus Jakarta Sans', sans-serif` (pesos `400`, `500`, `600`, `700`) — lectura nítida, técnica y profesional para fichas ópticas y filtros.
- **Números Tabulares (`tabular-nums`):** Precios (`$89.990`) y medidas de calibre (`52-18-140`) perfectamente alineados.
