// Lectura de las entradas del cuaderno (servidor, solo lo publicado).
import { supabase } from './supabase.js'

/**
 * Fila de Supabase → entrada en el idioma pedido. En euskera, una entrada
 * sin título_eu no existe (se devuelve null) para no publicar páginas en
 * euskera con el texto en castellano.
 */
export function mapRow(r, lang = 'es') {
  const eu = lang === 'eu'
  if (eu && !r.titulo_eu) return null
  return {
    id: r.id,
    numero: r.numero,
    slug: r.slug,
    titulo: eu ? r.titulo_eu : r.titulo,
    extracto: (eu ? r.extracto_eu : r.extracto) || '',
    contenido: (eu ? r.contenido_eu : r.contenido) || '',
    fotos: Array.isArray(r.fotos) ? r.fotos : [],
    autor: r.autor,
    fase: r.fase,
    fecha: r.fecha,
    tieneEu: !!r.titulo_eu,
    updatedAt: r.updated_at,
  }
}

const CAMPOS =
  'id, numero, slug, titulo, extracto, titulo_eu, extracto_eu, fotos, autor, fase, fecha, updated_at'

// Solo en local sin Supabase configurado: entradas de ejemplo para ver el diseño.
const demo = async () => (await import('./demo.js')).DEMO

export async function getPosts(lang = 'es', limite = 200) {
  if (!supabase) return (await demo()).map((r) => mapRow(r, lang)).filter(Boolean).slice(0, limite)
  const { data, error } = await supabase
    .from('posts')
    .select(CAMPOS)
    .eq('publicado', true)
    .order('fecha', { ascending: false })
    .order('numero', { ascending: false })
    .limit(limite)
  if (error) throw error
  return data.map((r) => mapRow(r, lang)).filter(Boolean)
}

export async function getPost(slug, lang = 'es') {
  if (!supabase) {
    const r = (await demo()).find((p) => p.slug === slug)
    return r ? mapRow(r, lang) : null
  }
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('publicado', true)
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data ? mapRow(data, lang) : null
}
