// Mensajes del formulario de contacto → tabla `mensajes` (los socios los leen en el panel).
import { supabaseAdmin } from '../../lib/supabaseAdmin.js'
import { emailValido, nombreSospechoso, mensajeSospechoso, trampaBot, leerCuerpo, responder } from '../../lib/formularios.js'

export const prerender = false

export async function POST({ request }) {
  const cuerpo = await leerCuerpo(request).catch(() => null)
  if (!cuerpo) return new Response('Petición no válida', { status: 400 })
  const r = { ...cuerpo, request }
  const d = cuerpo.datos

  const bot = trampaBot(d)
  if (bot || nombreSospechoso(d.nombre) || mensajeSospechoso(d.mensaje)) {
    console.warn('[contacto] Bloqueado:', bot || 'contenido sospechoso')
    return responder(r, true) // "ok" falso: el bot no aprende
  }
  if (!emailValido(d.email) || !String(d.mensaje ?? '').trim()) return responder(r, false, 'Revisa el correo y el mensaje.')
  if (!supabaseAdmin) return responder(r, false, 'El formulario aún no está activo. Escríbenos por correo.')

  const { error } = await supabaseAdmin.from('mensajes').insert({
    nombre: String(d.nombre).trim().slice(0, 120),
    email: String(d.email).trim().toLowerCase(),
    mensaje: String(d.mensaje).trim().slice(0, 4000),
    idioma: d.idioma === 'eu' ? 'eu' : 'es',
  })
  if (error) {
    console.error('[contacto] No se guardó:', error.message)
    return responder(r, false, 'No se pudo enviar. Escríbenos por correo.')
  }
  return responder(r, true)
}
