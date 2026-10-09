# Mazkolandas Viñedos — contexto del proyecto

Web de **Mazkolandas Viñedos** (Nerea, Julen e Iñaki; viñedos en Cirauqui / Zirauki,
Navarra). Desarrollada por **Saúl Correyero** (Extreweb). Mismo patrón técnico que
Guadicar. Si algo aquí contradice al código, manda el código.

Producto y datos confirmados: [PRODUCT.md](PRODUCT.md). Dirección visual:
`.impeccable/surfaces/` (contrato) y `DESIGN.md` (sistema).

**Diseño actual: "láminas de ampelografía"** (paño verde viña, láminas botánicas de vid
en paspartú, Libre Caslon, granate solo en la acción principal). El primer diseño
(máquina de escribir, sellos, violeta) se descartó: a Saúl le parecía la web de una
marca de moda (Off-White), no de una bodega. La web tiene que leerse como vino y viña.

Las láminas de `public/laminas/` son de dominio público (J. Troncy para la *Ampélographie*
de Viala y Vermorel, 1901–1910, vía Wikimedia Commons) y van acreditadas en el pie de
cada lámina y en el pie de página. Ilustran variedades de Navarra; **no son sus cepas**.

## Stack

| Pieza | Detalle |
|---|---|
| Framework | Astro 6 (`output: 'static'` + `@astrojs/netlify`) |
| Datos | Supabase gratis: tabla `posts`, tabla `admins`, bucket `cuaderno` (público) |
| Hosting | Netlify gratis |
| Dominio | **sin comprar** (`mazkolandas.es` supuesto en `astro.config.mjs` y `public/robots.txt`) |
| Fuentes | Fontsource self-host (Libre Caslon Display/Text; Courier Prime solo para la insignia del logo), sin Google Fonts (RGPD) |

Sin analítica y sin cookies → no hace falta banner (la puerta de edad usa almacenamiento local técnico).

## Puesta en marcha (pendiente)

1. Crear proyecto en Supabase **en región UE (Frankfurt)**, la privacidad lo afirma → SQL Editor → ejecutar `sql/2026-10-esquema-inicial.sql`.
2. Authentication → desactivar "Allow new users to sign up". Crear los usuarios de los socios.
3. Meterlos en `admins` (último bloque del SQL). **Sin esto el panel no puede guardar.**
   Después ejecutar `sql/2026-10-vino.sql` (tabla del vino) y `sql/2026-10-formularios.sql`
   (mensajes de contacto y libro de registro).
4. Netlify: variables `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY` (no marcarlas como
   secret: rompe el build de Astro) y `SUPABASE_SERVICE_KEY` (service_role, **secreta**, solo
   la usan `/api/contacto` y `/api/suscribir`). Se aplican al redesplegar.
5. Dominio → cambiar `site` en `astro.config.mjs` y la línea `Sitemap:` de `robots.txt`.
   Si se compra también el `.com`, añadir redirección 301 en `public/_redirects` (como Guadicar).
6. Search Console: verificar dominio y enviar `/sitemap.xml`.

En local sin `.env` la web usa entradas de ejemplo (`src/lib/demo.js`) y el panel avisa.
En producción, sin las variables, falla a propósito.

## Cómo funciona

- **Páginas que leen de Supabase** (`/`, `/eu/`, `/cuaderno/…`, `/eu/koadernoa/…`,
  `/sitemap.xml`) llevan `prerender = false` y se cachean 1 h en el CDN de Netlify con la
  etiqueta `cuaderno` (`src/lib/cache.js`). El panel la purga al guardar o borrar
  (`/api/purgar`). Publicar **no** gasta un deploy (15 créditos).
- **Supabase gratis se pausa a los 7 días sin peticiones**: `netlify/functions/despertar.mjs`
  le hace una consulta diaria.
- **Panel** `/admin/` (estático, todo en el navegador con la sesión de Supabase). Las
  políticas RLS exigen estar en `admins`, no solo tener cuenta.
- **Texto de las entradas**: formato mínimo propio (`src/lib/texto.js`: párrafos, `## `,
  `- `, `**negrita**`, enlaces). Test: `npm test`.
- **Fotos**: se comprimen en el navegador a JPEG 1600 px (Safari iOS no genera WebP).
  Al quitar una foto se borra del Storage después de guardar, nunca antes.
- **Bilingüe**: castellano en `/`, euskera en `/eu/`. Textos fijos en `src/i18n.js` y en
  cada componente. Una entrada sin `titulo_eu` no existe en euskera (ni en hreflang).
  **El euskera lo tienen que revisar los socios.**

## Navegación, puerta de edad y formularios

- **ClientRouter** (transiciones entre páginas, en `Base.astro`): los `<script>` de los
  componentes corren **una sola vez**. Todo lo que toque el DOM va en
  `document.addEventListener('astro:page-load', …)` (también salta en la primera carga) y se
  limpia en `astro:before-swap` si deja algo vivo (la botella 3D libera su contexto WebGL ahí).
- **Animaciones al entrar en pantalla**: el elemento lleva `data-revelar` y un único observador
  en `Base.astro` le pone `.is-visible` (láminas, rueda del año, mapa del Camino).
- **Rueda del año** (`Ciclo.astro`, en la home y en el cuaderno): fases del cultivo con fechas
  orientativas de la zona media de Navarra y una aguja en el día de hoy (calculado en el
  servidor; esas páginas no se prerenderizan).
- **Mapa del Camino** (`Camino.astro`, en la sección de la viña): Puente la Reina → Estella con
  los pueblos en su sitio (lat/lon aproximadas) y escala real; ríos y curvas de nivel son esquema.
- **Puerta de edad** (`Edad.astro`): un script `is:inline` en el `<head>` pone
  `<html data-edad="ok">` antes de pintar si ya se confirmó (y otra vez en `astro:after-swap`,
  que sustituye los atributos de `<html>`), así no parpadea. El título **no es un `<h1>`**: el
  `<h1>` de cada página es el suyo (SEO).
- **Formularios** (`Contacto.astro` y `Suscripcion.astro`, script común
  `src/lib/enviarFormulario.js`): envían a `/api/contacto` y `/api/suscribir`, que guardan en
  Supabase con la clave de servicio tras el antispam de Guadicar (`src/lib/formularios.js`:
  honeypot `empresa`, trampa de tiempo `ts`, validación; a los bots se les dice "ok"). Funcionan
  también sin JavaScript (redirigen de vuelta con `?envio=ok`). La lista de espera exige marcar
  la casilla de privacidad.
- **Panel → Mensajes** (`/admin/mensajes/`): mensajes (responder, marcar leído, borrar) y libro
  de registro (copiar direcciones para **CCO**, descargar CSV, dar de baja).
- No hay aviso por correo de mensajes nuevos: los socios tienen que mirar el panel. Si hace
  falta, añadir Resend como en Guadicar (necesita dominio propio verificado).

## El vino y la botella 3D (sección `#vino` de la home)

- **Se edita desde el panel**: `/admin/vino/` (pestaña «Nuestro vino»). Datos en la fila
  única de la tabla `vino` (`sql/2026-10-vino.sql`, ejecutar después del esquema inicial).
  Archivos (etiqueta, contraetiqueta, .glb) en el bucket `cuaderno`, carpeta `vino/`.
  `src/data/vino.js` solo son los valores por defecto (local sin Supabase o tabla sin crear).
- El panel tiene **vista previa 3D en directo**: misma botella que la web.
- Sin `listo`: botella de muestra (etiqueta provisional) y ficha «por anunciar». Con
  `listo`: título = nombre del vino, ficha rellena, botón de compra opcional y schema `Product`.
- **Botella** (`src/lib/botella3d.js`): perfil con fondo picado girado con LatheGeometry;
  vidrio transmisivo (`thickness` ~4 mm: más grosor saca la vista fuera del vino en los
  bordes); vino = torno interior recortado por un plano **horizontal en el mundo** que se
  balancea con un muelle amortiguado (se pinta la superficie por las caras interiores);
  sombra de contacto. Vidrio algo claro (`transparencia` 0,32) y nivel al hombro (1,95) a
  propósito, para que se vea el vino moverse.
- **En la home es un plató oscuro a sangre** (`<Botella plato>`: escenario `estudio`, fondo
  `--plato` = el de la escena, encuadre corrido a la derecha con `desplazar` para dejar sitio al
  texto). Sin suelo sólido: uno iluminado dejaba una mancha parda detrás del texto.
- **Entrada con scroll**: llega desde el fondo, muy inclinada hacia el espectador, y se
  endereza de frente (la misma que la demo). En escritorio la sección se queda fija (240vh).
- **Botón «Verla a pantalla completa»** → `/demo/botella/`. Solo sale mientras exista
  `src/pages/demo/botella.astro` (`import.meta.glob` en `Inicio.astro`): al borrar la demo
  desaparece solo.
- Un `.glb` subido sustituye a la dibujada (se normaliza solo); ese modelo no lleva vino animado.
- three.js (~150 KB gzip) se descarga **solo** al acercarse a la sección.
- **Demo de presentación** `/demo/botella/` (noindex, bloqueada en robots): botellas de otras
  marcas sacadas de fotos con `scripts/botella-desde-foto.mjs`. Los fondos
  (`public/demo/fondo-*.jpg`) son **imágenes generadas con IA** (llevan marca SynthID de
  Google) y así lo dicen los créditos. **Borrar `public/demo/` y `src/pages/demo/` antes de
  publicar la web.**

## SEO

- Cada búsqueda objetivo tiene su página con texto real en el HTML: home ("viñedos y vino
  en Cirauqui, Navarra"), `/vinedos-en-navarra/` ("viñedos en Navarra"), cuaderno.
- Schema `Winery` en todas las páginas, `BlogPosting` en las entradas, hreflang es/eu
  en `<head>` y en el sitemap.
- Lo que más mueve "bodegas en Navarra" no es código: **ficha de Google Business**
  (categoría bodega/viñedo, en Cirauqui), reseñas, y enlaces desde Espacio Alpha,
  Los Vinos de Iruña, Ayuntamiento de Cirauqui, prensa navarra.
- No afirmar que el vino es D.O. Navarra ni la subzona de Cirauqui sin confirmarlo.
- Lo mismo con la forma de trabajar (p. ej. "mínima intervención", "vendimia manual"): solo
  si el cliente lo confirma. El mapa del Camino marca el pueblo (42°40′ N 1°53′ O, 493 m,
  Wikipedia), no su parcela. La rueda del año habla de "una viña de la zona media de
  Navarra", no de la suya.

## Pendiente — depende del cliente

- Datos legales (titular, NIF, domicilio): salen marcados en granate en `/aviso-legal/`
  y `/privacidad/`.
- Fotos reales en alta, logo en vector, nombre del vino, uva, añada.
- Revisión del euskera.
- Datos del vino y arte de la etiqueta (ver «La botella 3D»).
- ¿Visitas / enoturismo? Si sí, página propia (buena para SEO).
