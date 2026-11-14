# Reglas del Proyecto (`optica-lens-web`)

Este archivo define las reglas obligatorias que cualquier agente de IA debe respetar al modificar el código o el diseño de este proyecto.

## Reglas Estrictas de UI / UX

1. **PROHIBIDO agregar Badges / Etiquetas flotantes (Zero-Badges Rule)**:
   - **NUNCA** agregues *badges*, *pills* decorativos, etiquetas flotantes sobre imágenes (`Nuevo`, `Nuevo Drop`, `En Stock`, `Colección 2026`, categorías flotantes), ni píldoras promocionales sobre titulares o tarjetas, **a menos que el usuario lo pida explícitamente**.
   - Las fotografías de producto y banners deben lucir completamente limpias, sin etiquetas superpuestas.
   - Los encabezados de sección deben ir directo al título principal sin *badges* superiores.

2. **Hero Principal (`src/pages/index.astro`)**:
   - El Hero debe utilizar una imagen publicitaria *close-up* de rostro con lentes como fondo a pantalla completa (`100vw` y `100vh` / `min-h-dvh`), sin tarjetas de producto secundarias ni *badges* flotantes.

3. **Estilo Visual (Inspirado en OPV y Ben & Frank)**:
   - Estética moderna, juvenil, limpia y profesional (D2C Eyewear).
   - Tipografía geométrica (`Outfit` para titulares/precios + `Plus Jakarta Sans` para cuerpo de texto).
   - Superficies limpias en blanco (`#FFFFFF`) y gris frío sutil (`zinc-50` / `zinc-100`), texto en negro carbón (`zinc-950`) y acentos en azul (`blue-600`) o verde esmeralda para acciones de WhatsApp.
   - Cero emojis como íconos de interfaz; usar únicamente íconos SVG limpios.
