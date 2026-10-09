// Un solo sitemap con todo: páginas fijas y entradas del cuaderno, con sus
// versiones en euskera enlazadas (hreflang) para que Google las relacione.
import { getPosts } from '../lib/posts.js'
import { cachearEnCDN } from '../lib/cache.js'
import { RUTAS } from '../i18n.js'

export const prerender = false

export async function GET({ site }) {
  const url = (p) => new URL(p, site).href
  const par = (es, eu, lastmod) => ({ es, eu, lastmod })

  const posts = await getPosts('es').catch(() => [])
  const paginas = [
    par(RUTAS.es.inicio, RUTAS.eu.inicio, posts[0]?.updatedAt),
    par(RUTAS.es.vinedos, RUTAS.eu.vinedos),
    par(RUTAS.es.cuaderno, RUTAS.eu.cuaderno, posts[0]?.updatedAt),
    par(RUTAS.es.contacto, RUTAS.eu.contacto),
    ...posts.map((p) =>
      par(`${RUTAS.es.cuaderno}${p.slug}`, p.tieneEu ? `${RUTAS.eu.cuaderno}${p.slug}` : null, p.updatedAt),
    ),
    par('/aviso-legal/'),
    par('/privacidad/'),
    par('/cookies/'),
  ]

  const entrada = (loc, { es, eu, lastmod }) => {
    const alt = eu
      ? `\n    <xhtml:link rel="alternate" hreflang="es" href="${url(es)}"/>\n    <xhtml:link rel="alternate" hreflang="eu" href="${url(eu)}"/>`
      : ''
    const fecha = lastmod ? `\n    <lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ''
    return `  <url>\n    <loc>${url(loc)}</loc>${fecha}${alt}\n  </url>`
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paginas.flatMap((p) => [entrada(p.es, p), ...(p.eu ? [entrada(p.eu, p)] : [])]).join('\n')}
</urlset>`

  const headers = new Headers({ 'Content-Type': 'application/xml; charset=utf-8' })
  cachearEnCDN(headers)
  return new Response(xml, { headers })
}
