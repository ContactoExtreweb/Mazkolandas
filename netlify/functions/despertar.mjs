// Supabase gratis pausa el proyecto tras 7 días sin peticiones, y entonces el
// panel deja de funcionar. Esta función programada le hace una consulta al
// día para que nunca llegue a dormirse. Coste: despreciable (una petición).
export default async () => {
  const url = process.env.PUBLIC_SUPABASE_URL
  const key = process.env.PUBLIC_SUPABASE_ANON_KEY
  const res = await fetch(`${url}/rest/v1/posts?select=id&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  })
  console.log('[despertar] Supabase respondió', res.status)
}

export const config = { schedule: '@daily' }
