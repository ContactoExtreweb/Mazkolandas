// Vacía la caché de las páginas del cuaderno (ver src/lib/cache.js).
// La llama el panel después de guardar o borrar una entrada.
import { purgeCache } from '@netlify/functions'
import { supabase } from '../../lib/supabase.js'
import { ETIQUETA } from '../../lib/cache.js'

export const prerender = false

const json = (datos, status = 200) =>
  new Response(JSON.stringify(datos), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

export async function POST({ request }) {
  // El panel manda su token de sesión. Basta con comprobar que es válido:
  // el registro de usuarios está desactivado en Supabase.
  const token = (request.headers.get('authorization') || '').replace(/^Bearer /, '')
  const { data, error } =
    token && supabase ? await supabase.auth.getUser(token) : { data: null, error: true }
  if (error || !data?.user) return json({ error: 'Necesitas iniciar sesión en el panel.' }, 401)

  // En local no hay caché de Netlify que vaciar
  if (import.meta.env.DEV) return json({ ok: true, omitido: 'local' })

  try {
    await purgeCache({ tags: [ETIQUETA] })
    return json({ ok: true })
  } catch (e) {
    // No es grave: la caché caduca sola en una hora
    console.error('[purgar] No se pudo vaciar la caché:', e)
    return json({ ok: false }, 502)
  }
}
