# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro + Netlify + Supabase (decidido por Saúl, mismo patrón que Guadicar). Planes gratuitos: sin Netlify Pro ni Supabase Pro.

## Users

- **Visitantes**: gente que busca en Google vino, bodegas o viñedos de Navarra (no necesariamente "Mazkolandas"). Llegan desde el móvil la mayoría, también desde Instagram.
- **Los socios** (Nerea, Julen e Iñaki): publican entradas de blog desde el panel, probablemente desde el móvil y sin conocimientos técnicos.

## Product Purpose

Web de un proyecto vitícola nuevo de Navarra: contar quiénes son, dónde están sus viñedos, presentar su vino cuando salga y publicar noticias (blog). Éxito = aparecer en búsquedas genéricas ("bodegas en Navarra", "vinos de Navarra", "viñedos en Navarra"), no solo por el nombre de marca, y que los socios publiquen sin depender de nadie.

## Positioning

Proyecto joven de tres amigos con viñedos en Cirauqui / Zirauki (Navarra), seleccionado en el programa de emprendimiento Espacio Alpha. Identidad bilingüe castellano / euskera ("Navarra / Nafarroa").

## Operating Context

- Publican en Instagram (@mazkolandas) en castellano y euskera.
- Participan en eventos locales (sorteo de entradas para "Los Vinos de Iruña", septiembre 2026).
- Contacto: mazkolandas@outlook.com.

## Capabilities and Constraints

- Web bilingüe: castellano (por defecto) + euskera.
- Blog administrable desde un panel con login (Supabase Auth). Cada entrada tiene versión en castellano y, opcionalmente, en euskera.
- Sección de vino preparada pero sin publicar: el vino está embotellado, falta etiquetar. En el futuro: botella 3D girando que crece con el scroll.
- Visitas / enoturismo: **sin decidir**. No hay página de visitas.
- Sin tienda online por ahora.

## Brand Commitments

- Nombre: **MAZKOLANDAS VIÑEDOS**.
- Logo: tipográfico, estilo máquina de escribir, mayúsculas espaciadas "MAZKO / LANDAS" y "Viñedos" debajo, negro sobre blanco, dentro de un círculo. Falta el archivo vectorial (de momento, recreado en SVG en `src/components/Logo.astro`).
- La web tiene que leerse como bodega y viñedo al primer vistazo. Saúl rechazó un primer diseño tipográfico (máquina de escribir, sellos, violeta) porque "parece más la de Off-White que de una empresa que se dedica al vino". Nada de lenguaje de marca de moda: mayúsculas espaciadas, etiquetas, sellos.

## Evidence on Hand

- Bio de Instagram, tres publicaciones (sorteo Los Vinos de Iruña; presentación del equipo en Espacio Alpha, julio/agosto 2026).
- Fotos de Instagram (no descargadas): uvas en la viña, los tres socios en el campo.
- **No hay**: nombre del vino, variedades, hectáreas, dirección exacta, teléfono, precios, fotos en alta, logo en vector. No inventarlos.

## Product Principles

1. El SEO manda en la estructura: cada búsqueda objetivo tiene una página que la responde con texto real.
2. Publicar debe ser tan fácil como en Instagram (título, foto, texto, publicar).
3. Contar solo lo que es verdad: ni premios, ni variedades, ni datos que el cliente no haya dado.
4. Los dos idiomas son de primera; el euskera no es una traducción escondida.
