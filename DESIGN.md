---
name: Mazkolandas Viñedos
description: Un tratado de ampelografía de su propia viña, montado sobre paño verde.
colors:
  verde: "#243020"
  verde-2: "#34432e"
  sobre-verde: "#e8ecdf"
  sobre-verde-2: "#b9c2a8"
  papel: "#eef0e8"
  paspartu: "#f4f3ee"
  tinta: "#1d211b"
  tinta-2: "#4b5146"
  filete: "#c9cdbf"
  mosto: "#6b1f3a"
  mosto-hondo: "#521629"
  oro: "#b59a5a"
  campo: "#ffffff"
  error: "#a3141c"
typography:
  display:
    fontFamily: "Libre Caslon Display, Libre Caslon Text, Georgia, serif"
    fontSize: "clamp(2.6rem, 4.4vw + 0.8rem, 5.25rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Libre Caslon Display, Libre Caslon Text, Georgia, serif"
    fontSize: "clamp(1.9rem, 2.4vw + 1rem, 3rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  headline-prosa:
    fontFamily: "Libre Caslon Display, Libre Caslon Text, Georgia, serif"
    fontSize: "clamp(1.45rem, 1vw + 1.1rem, 1.85rem)"
    fontWeight: 400
    lineHeight: 1.1
  title:
    fontFamily: "Libre Caslon Display, Libre Caslon Text, Georgia, serif"
    fontSize: "clamp(1.4rem, 1.2vw + 1rem, 2rem)"
    fontWeight: 400
    lineHeight: 1.15
  body:
    fontFamily: "Libre Caslon Text, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
    fontFeature: "\"onum\""
  body-large:
    fontFamily: "Libre Caslon Text, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
  lead-large:
    fontFamily: "Libre Caslon Text, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.55
  lead:
    fontFamily: "Libre Caslon Text, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.65
  caption:
    fontFamily: "Libre Caslon Text, Georgia, serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Libre Caslon Text, Georgia, serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  none: "0"
spacing:
  linea: "1.5rem"
  margen: "max(16px, 5vw)"
  ancho: "1240px"
components:
  boton:
    backgroundColor: "{colors.mosto}"
    textColor: "{colors.paspartu}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0.95rem 1.5rem"
  boton-hover:
    backgroundColor: "{colors.mosto-hondo}"
    textColor: "{colors.paspartu}"
  boton-linea:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "0.95rem 1.5rem"
  boton-linea-hover:
    textColor: "{colors.mosto}"
  lamina-monte:
    backgroundColor: "{colors.paspartu}"
    rounded: "{rounded.none}"
    padding: "clamp(0.8rem, 2.4vw, 1.7rem)"
  campo-panel:
    backgroundColor: "{colors.campo}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "0.7rem 0.8rem"
---

# Design System: Mazkolandas Viñedos

## Overview

**Creative North Star: "Láminas de ampelografía"**

La web es un tratado de ampelografía de su propia viña: láminas de hoja y racimo montadas en paspartú sobre paño verde de encuadernación, con su pie en cursiva, su procedencia y anotaciones de botánico trazadas a mano. Se alternan dos campos a todo el ancho: el paño verde (cabecera, portada, vino, cabeceras de página, pie) y el papel de lámina frío para leer. Todo se dice con una sola familia, Libre Caslon, en redonda y cursiva.

Tiene que leerse como bodega y viñedo al primer vistazo, nunca como marca de moda. Por eso no hay mayúsculas espaciadas, ni etiquetas, ni sellos: las etiquetas son cursivas en minúscula, como la letra de un botánico. La densidad es de libro: márgenes amplios, prosa a 66ch, ritmo vertical en múltiplos de una línea (1.5rem). El material es plano: papel, filete y tinta; sin sombras, sin degradados, sin esquinas redondeadas.

Las láminas son de dominio público (J. Troncy para la *Ampélographie* de Viala y Vermorel, 1901–1910) e ilustran variedades de Navarra; siempre van acreditadas y nunca se presentan como las cepas del cliente.

**Key Characteristics:**
- Paño verde y papel de lámina alternados en bandas a todo el ancho.
- Láminas montadas en paspartú con filete dorado interior y pie en cursiva con autoría.
- Anotaciones de botánico: línea guía fina que se dibuja al cargar; al pasar, la parte se rodea en granate.
- Libre Caslon Display para titulares, Libre Caslon Text para todo lo demás; cifras de estilo antiguo.
- Granate de mosto solo para la acción principal y los estados activos.
- Filetes de 1px como única estructura: fichas, índices, separadores.

## Colors

Una paleta de encuadernación: verde viña profundo, papel frío, tinta verdosa, un granate de mosto escaso y un dorado que solo vive en filetes.

### Primary
- **Granate de mosto** (`mosto`): fondo del botón principal, hover de enlaces, foco, selección, viñeta de listas, firma de los socios, fase del cuaderno, óvalo y línea de la anotación al pasar. `mosto-hondo` es su hover.

### Secondary
- **Dorado de filete** (`oro`): solo filetes finos sobre o junto al verde: el filete interior del paspartú, el subrayado de la navegación activa, el filete sobre el nombre en portada, el marco vacío del vino. Sobre el verde también es el color de foco y de selección.

### Neutral
- **Paño verde viña** (`verde`): el campo dominante. `verde-2` es su filete (separadores del pie, fichas sobre verde, barra de desplazamiento).
- **Texto sobre verde** (`sobre-verde`) y su versión apagada (`sobre-verde-2`) para notas, pies y términos de ficha sobre el paño.
- **Papel de lámina** (`papel`): fondo de lectura de todo el cuerpo.
- **Paspartú** (`paspartu`): el cartón donde se monta cada lámina y el blanco cálido de los titulares sobre verde y del texto del botón.
- **Tinta** (`tinta`) para el texto; **tinta apagada** (`tinta-2`) para notas, metadatos, términos de ficha y pies.
- **Filete** (`filete`): líneas finas entre filas sobre papel.

### Panel
- **Blanco de campo** (`campo`): fondo de los campos de formulario del panel, para que se distingan del papel.
- **Rojo de error** (`error`): solo avisos de error y la acción de borrar del panel; nunca en la web pública.

### Named Rules
**The Mosto Rule.** El granate es la acción principal y el estado activo; nunca fondo de sección ni decoración. Una pantalla tiene, como mucho, un botón granate relleno.

**The Gold Thread Rule.** El dorado es una línea de 1px, nunca un relleno ni un color de texto.

## Typography

**Display Font:** Libre Caslon Display (con Libre Caslon Text, Georgia)
**Body Font:** Libre Caslon Text, redonda, cursiva y negrita 700 (con Georgia)

**Character:** Un Caslon de imprenta de tratado: la Display a 400 para titulares grandes y sueltos; la Text en cursiva hace de voz del botánico para etiquetas, pies, notas y metadatos.

### Hierarchy
- **Display** (400, clamp de 2.6rem a 5.25rem, 1.02, -0.02em): el H1 de cada página, siempre sobre verde en paspartú. Las páginas interiores escalan el mismo papel algo más bajo (4.5rem viñedos, 4.25rem entrada, 3.75rem legal).
- **Headline** (400, clamp de 1.9rem a 3rem, 1.1): títulos de sección.
- **Headline de prosa** (400, clamp de 1.45rem a 1.85rem, 1.1): H2 dentro de textos largos y de las preguntas frecuentes.
- **Title** (400, clamp de 1.4rem a 2rem, 1.15): títulos del índice del cuaderno y el correo del pie.
- **Lead grande** (1.25rem, 1.55): extracto bajo el H1 de una entrada y firma de los socios.
- **Lead** (1.1875rem, 1.65): entradillas bajo el H1 y textos de sección destacados.
- **Body grande** (1.125rem, 1.7): prosa larga (cuerpo de entradas, viñedos, carta de quiénes somos).
- **Body** (1.0625rem, 1.7, cifras de estilo antiguo): todo el texto, a 66ch como máximo.
- **Caption** (0.875rem, 1.5): pies de lámina, línea legal del pie y ayudas del panel.
- **Label** (cursiva, 0.875–0.95rem, minúscula, sin espaciado): notas, pies de lámina, términos de ficha, metadatos, selector de idioma.

### Named Rules
**The Botanist's Hand Rule.** Toda etiqueta es cursiva y en minúscula de frase. Nunca versalitas, nunca mayúsculas con espaciado, nunca letter-spacing positivo.

**The One Family Rule.** Solo Libre Caslon. La letra de máquina de escribir pertenece únicamente a la insignia del logo; no es un rol tipográfico.

## Layout

Bandas a todo el ancho que alternan paño verde y papel; dentro, un marco de 1240px como máximo con margen lateral `max(16px, 5vw)`. El ritmo vertical se mide en líneas de 1.5rem: secciones de 3 a 5 líneas de relleno, títulos con 1.25 líneas debajo, pie separado 4 líneas.

Las composiciones son rejillas de dos columnas asimétricas a partir de 900px (lámina y texto, texto y ficha) con calles amplias de 5–6rem; por debajo apilan en una columna y, en la portada, la lámina pasa detrás del titular. En escritorio la lámina de portada se dimensiona por la altura de la ventana para caber en el primer vistazo. La ficha de viñedos queda fija al desplazarse. El índice del cuaderno reserva siempre la columna de la foto para que los títulos alineen. El pie es una rejilla de 1.5fr / 1fr / 1fr desde 760px.

## Elevation & Depth

Totalmente plano. La profundidad la dan el contraste de campos (paño verde contra papel) y el montaje: el paspartú, más claro que el fondo, con un filete dorado interior a 7px de la imagen, sugiere el cartón de una lámina enmarcada sin una sola sombra.

### Named Rules
**The Mounted, Not Lifted Rule.** Nada flota: ni sombras, ni degradados, ni desenfoques. Si algo necesita destacar, se monta en paspartú o se separa con un filete.

## Shapes

Esquinas rectas en todo (radio 0), incluidos botones y campos del panel. La única forma curva es el círculo: la insignia del logo, el punto de cada anotación y el óvalo trazado a lápiz que rodea la parte señalada. Las líneas son filetes de 1px; los signos de abrir/cerrar de los desplegables se dibujan con dos filetes granates que giran, no con el triángulo del navegador.

## Components

### Buttons
Sobrios y de imprenta: texto en Caslon a tamaño de lectura, sin mayúsculas.
- **Shape:** recto (0), borde de 1px.
- **Primary:** granate de mosto relleno con texto paspartú, relleno 0.95rem × 1.5rem; flecha en SVG a 1.1em opcional.
- **Hover / Focus:** pasa a `mosto-hondo` en 0.2s y la flecha avanza 3px; foco con contorno granate de 2px a 3px de distancia (dorado sobre verde).
- **Línea:** transparente con borde del color del texto; al pasar, borde y texto granate (paspartú sobre verde).
- **Panel:** botón pequeño de texto con borde `tinta-2` (0.875rem); la variante de peligro pasa a rojo al pasar.

### Cards / Containers
No hay tarjetas. Los contenidos se agrupan con filetes: la **ficha** es una lista de definiciones en dos columnas, filete superior del color del texto y filetes `filete` entre filas, términos en cursiva apagada. Sobre verde, los filetes pasan a `verde-2`.

### Inputs / Fields
Solo en el panel: fondo blanco, borde de 1px `tinta-2`, radio 0, relleno 0.7rem × 0.8rem. Foco: contorno granate de 2px y borde granate. Etiquetas de campo en negrita 700 a 0.95rem; ayudas en `tinta-2` a 0.875rem. Casillas con `accent-color` granate.

### Navigation
Cabecera sobre verde: insignia redonda a 76px (52px en móvil) a la izquierda, enlaces en Caslon Text a la derecha, sin subrayado; al pasar y en la página actual aparece un filete dorado de 1px debajo. El selector de idioma va en cursiva apagada. En móvil la lista se envuelve y baja a 0.95rem. El panel usa la misma barra verde, fija arriba, con la marca en Caslon Display y «panel» en cursiva.

### Lámina (signature)
La pieza que define el sistema. Imagen montada sobre paspartú con relleno fluido, filete dorado interior a 7px y pie en cursiva con autoría y fecha. Opcionalmente lleva anotaciones de botánico en SVG: punto circular, línea guía de tinta que se dibuja al cargar (0.9s, escalonada 0.35s) y etiqueta en cursiva que aparece después. Al pasar sobre una anotación, punto, línea y etiqueta pasan a granate y un óvalo granate se traza alrededor de la parte (0.6s). Con movimiento reducido todo aparece ya dibujado. Las anotaciones se repiten como texto para lectores de pantalla. Variante vacía: el paspartú sin imagen con su filete dorado y «Lámina en preparación» en cursiva, para lo que aún no existe (el vino).

### Logo
Insignia redonda: círculo de trazo fino con «MAZKO / LANDAS» y «Viñedos» en Courier Prime, en el color del texto (`sobre-verde` sobre la cabecera). Es el logo del cliente recreado en SVG hasta que llegue el vector; su letra de máquina y su espaciado son parte de la marca y no se trasladan a ningún otro elemento.

## Do's and Don'ts

### Do:
- **Do** alternar bandas de paño verde y papel a todo el ancho; cabeceras de página y pie siempre en verde.
- **Do** montar toda imagen importante en paspartú con filete dorado interior y pie en cursiva con autoría.
- **Do** acreditar cada lámina histórica (J. Troncy, Viala y Vermorel, 1901–1910) y no presentarla nunca como la viña del cliente.
- **Do** escribir etiquetas, metadatos y notas en cursiva Caslon Text en minúscula.
- **Do** separar con filetes de 1px y medir el espacio vertical en múltiplos de 1.5rem.
- **Do** dar al botón granate relleno solo la acción principal de la pantalla.

### Don't:
- **Don't** usar mayúsculas espaciadas, versalitas, etiquetas, sellos ni ningún lenguaje de marca de moda.
- **Don't** usar sombras, degradados ni esquinas redondeadas.
- **Don't** usar Courier Prime fuera de la insignia del logo.
- **Don't** usar el dorado como relleno o color de texto, ni el granate como fondo de sección.
- **Don't** poner fotos de viñedo a sangre con serif dorada encima.
