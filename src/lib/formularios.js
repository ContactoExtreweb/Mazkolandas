// Antispam y validación de los formularios públicos (contacto y lista de espera).
// Mismo blindaje que Guadicar, que recibía ~20 envíos basura al día:
// honeypot, trampa de tiempo y validación en el servidor. A los bots se les
// responde "ok" para que no reintenten.

export const emailValido = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(String(e ?? '').trim())

/** Nombres aleatorios tipo "czQUDEldAeDbtCisHbxVjgV", enlaces o dígitos. */
export function nombreSospechoso(nombre) {
  const n = String(nombre ?? '').trim()
  if (n.length < 2 || n.length > 80) return true
  if (/https?:|www\.|[<>]|\d/i.test(n)) return true
  return (n.match(/[a-záéíóúüñ][A-ZÁÉÍÓÚÜÑ]/g) || []).length > 2
}

/** Varios enlaces o código en el mensaje = spam. */
export function mensajeSospechoso(msg) {
  const m = String(msg ?? '')
  if (m.length > 4000) return true
  if (/\[url=|<a\s|<script/i.test(m)) return true
  return (m.match(/https?:\/\/|www\./gi) || []).length >= 2
}

/** Honeypot (campo oculto "empresa") y envío demasiado rápido. Devuelve el motivo o null. */
export function trampaBot(datos, msMinimo = 3000) {
  if (String(datos?.empresa ?? '').trim() !== '') return 'honeypot'
  const ts = Number(datos?.ts)
  if (!ts) return 'sin marca de tiempo'
  const pasado = Date.now() - ts
  if (pasado >= 0 && pasado < msMinimo) return `enviado en ${pasado} ms`
  return null
}

/** Lee el cuerpo como JSON o como formulario normal (sin JavaScript). */
export async function leerCuerpo(request) {
  const tipo = request.headers.get('content-type') || ''
  if (tipo.includes('application/json')) return { datos: await request.json(), html: false }
  const f = await request.formData()
  return { datos: Object.fromEntries(f), html: true }
}

/** Respuesta: JSON para fetch; redirección de vuelta para el formulario sin JavaScript. */
export function responder({ html, request }, ok, error = '') {
  if (html) {
    const vuelta = new URL(request.headers.get('referer') || '/', request.url)
    vuelta.searchParams.set('envio', ok ? 'ok' : 'error')
    vuelta.hash = 'formulario'
    return Response.redirect(vuelta.href, 303)
  }
  return new Response(JSON.stringify(ok ? { ok: true } : { ok: false, error }), {
    status: ok ? 200 : 400,
    headers: { 'Content-Type': 'application/json' },
  })
}
