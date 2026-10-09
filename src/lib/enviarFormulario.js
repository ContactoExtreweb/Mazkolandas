// Envía los formularios públicos (form[data-envio]) por fetch y enseña el
// resultado en su <p role="status">. Sin JavaScript, el formulario se envía
// igual al endpoint y vuelve a la página.

function preparar(form) {
  if (form.dataset.listo) return
  form.dataset.listo = ''
  // Trampa de tiempo: momento real en que el visitante ve el formulario
  form.elements.namedItem('ts').value = String(Date.now())
  const estado = form.querySelector('[role="status"]')
  const boton = form.querySelector('button[type="submit"]')
  const avisar = (texto, tipo) => {
    estado.textContent = texto
    estado.dataset.tipo = tipo
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (!form.reportValidity()) return
    boton.disabled = true
    avisar(form.dataset.enviando, 'info')
    try {
      const datos = Object.fromEntries(new FormData(form))
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
      const r = await res.json().catch(() => ({}))
      if (!res.ok || !r.ok) throw new Error(r.error || form.dataset.error)
      avisar(form.dataset.ok, 'ok')
      form.reset()
      form.elements.namedItem('ts').value = String(Date.now())
    } catch (err) {
      avisar(err.message || form.dataset.error, 'error')
    } finally {
      boton.disabled = false
    }
  })
}

export function prepararFormularios() {
  document.querySelectorAll('form[data-envio]').forEach(preparar)
  // Vuelta del envío sin JavaScript (?envio=ok|error)
  const envio = new URLSearchParams(location.search).get('envio')
  const form = document.querySelector('form[data-envio]')
  if (envio && form) {
    const estado = form.querySelector('[role="status"]')
    estado.textContent = envio === 'ok' ? form.dataset.ok : form.dataset.error
    estado.dataset.tipo = envio === 'ok' ? 'ok' : 'error'
  }
}
