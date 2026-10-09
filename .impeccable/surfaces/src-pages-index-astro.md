---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/cuaderno","src/pages/admin"]
---

# Web pública Mazkolandas (home, viñedos, cuaderno/blog, entradas) + panel

Scope: web pública bilingüe (es/eu) y panel de administración del blog. REDISEÑO: el mundo "parte de campo mecanografiado" queda descartado (el usuario dijo que parecía Off-White, no una bodega).
Visitor mode: Persuade (home, viñedos); Read (cuaderno y entradas); Operate (panel /admin).

Audience: gente de Navarra y aficionados al vino que buscan bodegas, vinos o viñedos de Navarra, casi siempre desde el móvil. Job: entender quiénes son, dónde está la viña, qué vino viene y seguirles. Action: leer el cuaderno, escribir por email, seguir en Instagram.
Proof/content: solo lo confirmado en PRODUCT.md. Láminas de dominio público (Viala y Vermorel, 1901) acreditadas como tales: ilustran variedades de Navarra, nunca se presentan como sus cepas.
Constraints: que se reconozca vino y viña al primer vistazo; el SEO manda (H1 y textos con "viñedos", "vino", "Navarra", "Cirauqui"); texto real en el HTML del servidor; la sección del vino deja hueco para la botella 3D futura.

## Direction contract

THESIS: La web es un tratado de ampelografía de su propia viña: láminas de hoja y racimo montadas sobre paño verde, con su nombre, su procedencia y anotaciones de botánico. Rechaza tanto la foto de viñedo a sangre con serif dorada como cualquier lenguaje de moda (mayúsculas espaciadas, etiquetas, sellos).

OWN-WORLD: Paño de encuadernación verde viña #243020 como campo dominante, papel de lámina frío #eef0e8 para la lectura, tinta #1d211b, granate de mosto #6b1f3a reservado a la acción principal, dorado de filete #b59a5a solo en filetes finos sobre el verde. Libre Caslon Display para titulares y Libre Caslon Text (redonda y cursiva) para todo lo demás; las etiquetas van en cursiva y en minúscula, nunca en versalitas espaciadas. Piezas: lámina montada en paspartú con filete interior, pie de lámina en cursiva con autoría, anotaciones con línea guía fina, ficha descriptiva con filetes, marco vacío "lámina en preparación". Sin sombras, sin degradados, sin esquinas redondeadas.

STORY: El visitante ve uva y viña al instante, entiende que tres amigos cultivan viña en Cirauqui y que su primer vino está en botella, se cree un proyecto con raíz y cuidado; lee el cuaderno, escribe o sigue en Instagram.

FIRST VIEWPORT: Campo verde a todo el ancho. A la izquierda, la lámina de la garnacha montada en su paspartú, a casi toda la altura, con tres anotaciones de botánico (hoja, racimo, sarmiento) que se trazan solas al cargar. A la derecha, el nombre en Caslon, el H1 «Viñedos y vino en Cirauqui, Navarra», una línea de entrada y la acción principal granate «Leer el cuaderno» con «Escríbenos» al lado. Debajo de la lámina, su pie en cursiva con autoría. Interacción distintiva: las líneas guía de las anotaciones se dibujan y sus etiquetas aparecen; al pasar sobre una etiqueta se resalta su parte.

FORM: Láminas de ampelografía, posición 1 de mi lista ordenada (elegida por el usuario como IMPECCABLE’S PICK en la re-tirada 1), seed key 178318f5.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Logo en vector del cliente (de momento, insignia redonda tecleada recreada en SVG).
- Fotos reales, nombre del vino, uva, añada: sin datos.
- Visitas/enoturismo: sin decidir.
