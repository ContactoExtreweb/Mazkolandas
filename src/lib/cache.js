// Caché en el CDN de Netlify para las páginas que leen de Supabase (home,
// cuaderno, entradas y sitemap). Mismo patrón que Guadicar: la página se
// genera una vez y Netlify la sirve desde su caché durante una hora, así no
// se gastan créditos ni consultas en cada visita.
//
// El panel purga la etiqueta "cuaderno" al guardar o borrar una entrada
// (ver /api/purgar), y un despliegue nuevo también vacía la caché.

export const ETIQUETA = 'cuaderno'

/** @param {Headers} headers */
export function cachearEnCDN(headers) {
  // Navegador: que pregunte siempre (así nunca se queda con una versión vieja)
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
  // CDN de Netlify: 1 hora; pasada la hora sirve la copia anterior mientras
  // genera la nueva (hasta 10 min).
  headers.set(
    'Netlify-CDN-Cache-Control',
    'public, durable, s-maxage=3600, stale-while-revalidate=600',
  )
  headers.set('Netlify-Cache-Tag', ETIQUETA)
}
