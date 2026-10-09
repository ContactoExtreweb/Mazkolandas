// Utilidades de texto compartidas por la web y el panel.

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// Formato en línea: **negrita** y [texto](https://enlace). Se aplica sobre
// texto ya escapado, y solo se admiten enlaces http(s) o rutas internas.
const enLinea = (s) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/g, (_, txt, url) => {
      const fuera = !url.startsWith('/')
      return `<a href="${url}"${fuera ? ' rel="noopener" target="_blank"' : ''}>${txt}</a>`
    })

/**
 * Convierte el texto que escriben los socios en el panel a HTML.
 * Reglas (las mismas que explica la ayuda del formulario):
 *   - una línea en blanco separa párrafos
 *   - "## " al principio de una línea → subtítulo
 *   - "- " al principio de las líneas → lista
 * ponytail: sin tablas, citas ni imágenes en línea; si las piden, cambiar a
 * una librería de Markdown.
 */
export function aHTML(texto) {
  return String(texto ?? '')
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => {
      if (b.startsWith('## ')) return `<h2>${enLinea(b.slice(3))}</h2>`
      const lineas = b.split('\n')
      if (lineas.every((l) => l.startsWith('- ')))
        return `<ul>${lineas.map((l) => `<li>${enLinea(l.slice(2))}</li>`).join('')}</ul>`
      return `<p>${lineas.map(enLinea).join('<br>')}</p>`
    })
    .join('\n')
}

/** "Poda de invierno en Zirauki" → "poda-de-invierno-en-zirauki" */
export const slugify = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '')

/** 7 → "007" */
export const numero = (n) => String(n ?? 0).padStart(3, '0')

/** "2026-09-16" → "16.09.2026" (fecha de máquina de escribir, igual en es y eu) */
export const fecha = (iso) => {
  const [a, m, d] = String(iso ?? '').slice(0, 10).split('-')
  return a && m && d ? `${d}.${m}.${a}` : ''
}

/** Texto plano corto para meta descripciones. */
export const resumen = (s, max = 155) => {
  const t = String(s ?? '').replace(/[#*\-\[\]()]/g, ' ').replace(/\s+/g, ' ').trim()
  return t.length > max ? t.slice(0, max - 1).replace(/\s\S*$/, '') + '…' : t
}
