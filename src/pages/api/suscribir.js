// Lista de espera del primer vino → tabla `suscriptores` (email único).
import { supabaseAdmin } from '../../lib/supabaseAdmin.js'
import { emailValido, trampaBot, leerCuerpo, responder } from '../../lib/formularios.js'

export const prerender = false

export async function POST({ request }) {
  const cuerpo = await leerCuerpo(request).catch(() => null)
  if (!cuerpo) return new Response('Petición no válida', { status: 400 })
  const r = { ...cuerpo, request }
  const d = cuerpo.datos

  const bot = trampaBot(d, 2000)
  if (bot) {
    console.warn('[suscribir] Bloqueado:', bot)
    return responder(r, true)
  }
  if (!emailValido(d.email)) return responder(r, false, 'Revisa el correo.')
  if (!d.acepto) return responder(r, false, 'Falta aceptar la política de privacidad.')
  if (!supabaseAdmin) return responder(r, false, 'La inscripción aún no está activa. Escríbenos por correo.')

  // Si ya estaba apuntado, no es un error: ignoreDuplicates
  const { error } = await supabaseAdmin
    .from('suscriptores')
    .upsert({ email: String(d.email).trim().toLowerCase(), idioma: d.idioma === 'eu' ? 'eu' : 'es' }, { onConflict: 'email', ignoreDuplicates: true })
  if (error) {
    console.error('[suscribir] No se guardó:', error.message)
    return responder(r, false, 'No se pudo apuntar. Escríbenos por correo.')
  }
  return responder(r, true)
}
