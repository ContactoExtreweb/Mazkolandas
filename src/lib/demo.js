// ENTRADAS DE EJEMPLO — solo se usan en local cuando no hay .env de Supabase.
// Nunca llegan a producción (supabase.js lanza un error sin las variables).

const foto = (texto, tono) =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 933"><rect width="1400" height="933" fill="${tono}"/><text x="700" y="480" font-family="Georgia" font-style="italic" font-size="48" fill="#f4f3ee" text-anchor="middle">Foto de ejemplo · ${texto}</text></svg>`,
  )

export const DEMO = [
  {
    id: 'd3', numero: 3, slug: 'sorteo-los-vinos-de-iruna', fecha: '2026-09-16',
    autor: 'Nerea', fase: 'vendimia', updated_at: '2026-09-16T10:00:00Z',
    titulo: '[Ejemplo] Sorteamos dos entradas para Los Vinos de Iruña',
    extracto: '¿Con quién te irías a brindar por Navarra? Sorteamos una entrada doble para Los Vinos de Iruña.',
    contenido: 'Texto de ejemplo para ver cómo queda una entrada.\n\n## Cómo participar\n\n- Sigue a @espacioalpha_ y a nuestra cuenta.\n- Dale me gusta a la publicación.\n- Compártela en tus stories y menciónanos.\n\nPuedes participar hasta el **22 de septiembre**. Más en [Instagram](https://www.instagram.com/mazkolandas/).',
    titulo_eu: '[Adibidea] Los Vinos de Iruña ekitaldirako sarrera bikoitz bat zozketatzen dugu',
    extracto_eu: 'Norekin joango zinateke Nafarroaren alde topa egitera?',
    contenido_eu: 'Adibide-testua.',
    fotos: [{ url: foto('vendimia', '#6b1f3a'), pie: 'Racimos en la viña, Cirauqui, septiembre de 2026.' }],
  },
  {
    id: 'd2', numero: 2, slug: 'quienes-somos-espacio-alpha', fecha: '2026-08-05',
    autor: 'Julen', fase: 'envero', updated_at: '2026-08-05T10:00:00Z',
    titulo: '[Ejemplo] Antes que emprendedores, amigos',
    extracto: 'Así nos conocimos los tres y así empezó Mazkolandas, uno de los proyectos de Espacio Alpha.',
    contenido: 'Texto de ejemplo.\n\nSegundo párrafo de ejemplo con algo más de texto para ver la medida de línea en pantallas grandes y en el móvil.',
    titulo_eu: null, extracto_eu: null, contenido_eu: null,
    fotos: [],
  },
  {
    id: 'd1', numero: 1, slug: 'primera-entrada-del-cuaderno', fecha: '2026-07-31',
    autor: 'Iñaki', fase: 'envero', updated_at: '2026-07-31T10:00:00Z',
    titulo: '[Ejemplo] Antes de llegar a la copa, todo empieza aquí',
    extracto: 'Primera entrada del cuaderno de campo: la viña de Cirauqui en pleno verano.',
    contenido: 'Texto de ejemplo.',
    titulo_eu: '[Adibidea] Kopara iritsi aurretik, dena hemen hasten da',
    extracto_eu: 'Landa-koadernoko lehen sarrera.',
    contenido_eu: 'Adibide-testua.',
    fotos: [{ url: foto('la viña', '#34432e'), pie: 'La viña en verano, Cirauqui.' }],
  },
]
