// Botella desde foto: saca de una foto de estudio (botella de frente, fondo claro)
// la forma exacta, la etiqueta y la cápsula, listas para la botella 3D.
//
//   node scripts/botella-desde-foto.mjs <foto en public/> <id> [--base <fila>] [--capsula <fila>]
//   ej.: node scripts/botella-desde-foto.mjs demo/angelus.jpg angelus
//
// Necesita el servidor de desarrollo encendido (npm run dev) y Chrome instalado.
// Escribe en public/demo/<id>/: botella.json, etiqueta.jpg y capsula.jpg.
// --base, --capsula y --etiqueta y0,y1 (filas en píxeles de la foto) corrigen la detección automática
// si la foto tiene reflejo debajo o la cápsula se confunde con el vidrio.
import { spawn } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const [foto, id, ...resto] = process.argv.slice(2)
if (!foto || !id) {
  console.error('Uso: node scripts/botella-desde-foto.mjs <foto en public/> <id> [--base fila] [--capsula fila]')
  process.exit(1)
}
const opcion = (n) => {
  const i = resto.indexOf(n)
  return i >= 0 ? Number(resto[i + 1]) : null
}
const etq = resto.includes('--etiqueta') ? resto[resto.indexOf('--etiqueta') + 1].split(',').map(Number) : null
const ajustes = { base: opcion('--base'), capsula: opcion('--capsula'), etiqueta: etq }

// ── Análisis (se ejecuta dentro del navegador, sobre la propia imagen) ──
function analizar(ajustes) {
  const img = document.images[0]
  const W = img.naturalWidth
  const H = img.naturalHeight
  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  const g = cv.getContext('2d', { willReadFrequently: true })
  g.drawImage(img, 0, 0)
  const px = g.getImageData(0, 0, W, H).data
  const at = (x, y) => {
    const i = (y * W + x) * 4
    return [px[i], px[i + 1], px[i + 2]]
  }
  const lum = ([r, gg, b]) => 0.2126 * r + 0.7152 * gg + 0.0722 * b
  const sat = ([r, gg, b]) => Math.max(r, gg, b) - Math.min(r, gg, b)
  const fondo = (c) => lum(c) > 232 && sat(c) < 18

  // Silueta fila a fila: primer y último píxel que no es fondo (3 seguidos)
  const filas = []
  for (let y = 0; y < H; y++) {
    let l = -1
    let r = -1
    for (let x = 2; x < W - 2; x++) {
      if (!fondo(at(x, y)) && !fondo(at(x + 1, y)) && !fondo(at(x + 2, y))) {
        l = x
        break
      }
    }
    for (let x = W - 3; x > 2; x--) {
      if (!fondo(at(x, y)) && !fondo(at(x - 1, y)) && !fondo(at(x - 2, y))) {
        r = x
        break
      }
    }
    filas.push(l >= 0 && r > l ? { l, r } : null)
  }
  const ancho = (y) => (filas[y] ? filas[y].r - filas[y].l : 0)
  const anchoMax = Math.max(...filas.map((f, y) => ancho(y)))
  const top = filas.findIndex((f, y) => ancho(y) > anchoMax * 0.12)

  // Centro: mediana de los centros de las filas anchas
  const centros = filas
    .map((f, y) => (ancho(y) > anchoMax * 0.8 ? (f.l + f.r) / 2 : null))
    .filter((v) => v !== null)
    .sort((a, b) => a - b)
  const cx = centros[Math.floor(centros.length / 2)]

  // Luminosidad media de una franja central de la fila (para cápsula, etiqueta y reflejo)
  const media = (y, frac = 0.25) => {
    const f = filas[y]
    if (!f) return [255, 255, 255]
    const a = Math.round(cx - (f.r - f.l) * frac)
    const b = Math.round(cx + (f.r - f.l) * frac)
    const s = [0, 0, 0]
    for (let x = a; x <= b; x++) {
      const c = at(x, y)
      s[0] += c[0]
      s[1] += c[1]
      s[2] += c[2]
    }
    return s.map((v) => v / (b - a + 1))
  }

  const claros = (y, frac = 0.35) => {
    const f = filas[y]
    if (!f) return 0
    const a = Math.round(cx - (f.r - f.l) * frac)
    const b = Math.round(cx + (f.r - f.l) * frac)
    let c = 0
    for (let x = a; x <= b; x++) if (lum(at(x, y)) > 140) c++
    return c / (b - a + 1)
  }

  // Etiqueta: el bloque más largo de filas mayoritariamente claras en la mitad inferior
  const desdeY = Math.round(top + (H - top) * 0.3)
  let mejor = [0, 0]
  let ini = -1
  for (let y = desdeY; y < H; y++) {
    const claro = claros(y) > 0.45 && ancho(y) > anchoMax * 0.7
    if (claro && ini < 0) ini = y
    if ((!claro || y === H - 1) && ini >= 0) {
      if (y - ini > mejor[1] - mejor[0]) mejor = [ini, y - 1]
      ini = -1
    }
  }
  const etiqueta = ajustes.etiqueta ? { y0: ajustes.etiqueta[0], y1: ajustes.etiqueta[1] } : { y0: mejor[0], y1: mejor[1] }

  // Base: lo que antes ocurra de (a) la silueta desaparece, (b) empieza un reflejo
  // (fila mucho más clara que el vidrio oscuro de encima)
  let base = ajustes.base
  if (!base) {
    base = H - 1
    for (let y = etiqueta.y1 + 20; y < H; y++) {
      if (ancho(y) < anchoMax * 0.5) {
        base = y - 1
        break
      }
      const m = lum(media(y, 0.35))
      const arriba = lum(media(y - 12, 0.35))
      if (m > 105 && arriba < 70) {
        base = y - 1
        break
      }
    }
  }
  const alto = base - top


  // Cápsula: el mayor salto de color en el tercio superior (fin de la cápsula)
  let capsula = ajustes.capsula
  if (!capsula) {
    let salto = 0
    for (let y = top + Math.round(alto * 0.06); y < top + alto * 0.33; y++) {
      const a = media(y - 4, 0.3)
      const b = media(y + 4, 0.3)
      const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
      if (d > salto) {
        salto = d
        capsula = y
      }
    }
  }

  // Perfil (radio, altura) en unidades de 10 cm: la botella mide 3 (30 cm)
  const k = 3 / alto
  const perfil = []
  const N = 90
  for (let i = 0; i <= N; i++) {
    const y = Math.round(base - (alto * i) / N)
    const f = filas[y]
    const rad = f ? Math.max(cx - f.l, f.r - cx) : 0
    perfil.push([+(rad * k).toFixed(4), +((base - y) * k).toFixed(4)])
  }

  // Desenrolla una franja de la foto del cilindro: columna u = ángulo, no x
  function desenrollar(y0, y1, theta) {
    const radio = (y) => (filas[y] ? Math.max(cx - filas[y].l, filas[y].r - cx) : 1)
    const altoPx = y1 - y0
    const anchoPx = Math.round(2 * theta * radio(Math.round((y0 + y1) / 2)))
    const out = document.createElement('canvas')
    out.width = anchoPx
    out.height = altoPx
    const og = out.getContext('2d')
    const dst = og.createImageData(anchoPx, altoPx)
    for (let j = 0; j < altoPx; j++) {
      const y = y0 + j
      const r = radio(y)
      for (let i = 0; i < anchoPx; i++) {
        const t = -theta + (2 * theta * i) / (anchoPx - 1)
        const x = cx + r * Math.sin(t)
        const x0 = Math.floor(x)
        const fx = x - x0
        const c0 = at(Math.min(Math.max(x0, 0), W - 1), y)
        const c1 = at(Math.min(Math.max(x0 + 1, 0), W - 1), y)
        const o = (j * anchoPx + i) * 4
        dst.data[o] = c0[0] * (1 - fx) + c1[0] * fx
        dst.data[o + 1] = c0[1] * (1 - fx) + c1[1] * fx
        dst.data[o + 2] = c0[2] * (1 - fx) + c1[2] * fx
        dst.data[o + 3] = 255
      }
    }
    og.putImageData(dst, 0, 0)
    return out.toDataURL('image/jpeg', 0.92)
  }

  const THETA = (72 * Math.PI) / 180 // de frente se ven bien ±72°; más allá se comprime
  return {
    foto: { W, H, top, base, cx, capsula, etiqueta },
    perfil,
    etiqueta: {
      desde: +((base - etiqueta.y1) * k).toFixed(4),
      hasta: +((base - etiqueta.y0) * k).toFixed(4),
      vuelta: +((2 * THETA) / (2 * Math.PI)).toFixed(4),
      imagen: desenrollar(etiqueta.y0, etiqueta.y1, THETA),
    },
    capsula: {
      desde: +((base - capsula) * k).toFixed(4),
      hasta: 3,
      vuelta: +((2 * THETA) / (2 * Math.PI)).toFixed(4),
      color: (() => {
        // los costados de la cápsula, a media altura (lejos de escudos y dibujos)
        const y = Math.round((top + capsula) / 2)
        const w = filas[y].r - filas[y].l
        const c = [at(Math.round(cx - w * 0.36), y), at(Math.round(cx + w * 0.36), y)]
        return [0, 1, 2].map((i) => Math.round((c[0][i] + c[1][i]) / 2))
      })(),
      imagen: desenrollar(top, capsula, THETA),
    },
  }
}

// ── Chrome sin ventana por el protocolo de depuración ──
const puerto = 9500 + Math.floor(Math.random() * 400)
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new',
  `--remote-debugging-port=${puerto}`,
  '--no-first-run',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'botella-'))}`,
  'about:blank',
])
const espera = (ms) => new Promise((r) => setTimeout(r, ms))
let ws
for (let i = 0; i < 50 && !ws; i++) {
  await espera(200)
  try {
    const t = await (await fetch(`http://127.0.0.1:${puerto}/json`)).json()
    ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl)
  } catch {}
}
await new Promise((r) => ws.addEventListener('open', r))
let n = 0
const pend = new Map()
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pend.has(m.id)) pend.get(m.id)(m)
})
const cdp = (method, params = {}) =>
  new Promise((r) => {
    const i = ++n
    pend.set(i, r)
    ws.send(JSON.stringify({ id: i, method, params }))
  })

await cdp('Page.navigate', { url: `http://localhost:4321/${foto}` })
await espera(2500)
const r = await cdp('Runtime.evaluate', {
  expression: `(${analizar})(${JSON.stringify(ajustes)})`,
  returnByValue: true,
})
chrome.kill()
if (r.result?.exceptionDetails || !r.result?.result?.value) {
  console.error('Falló el análisis:', JSON.stringify(r.result?.exceptionDetails ?? r).slice(0, 600))
  process.exit(1)
}
const datos = r.result.result.value

const dir = join('public', 'demo', id)
mkdirSync(dir, { recursive: true })
const guardar = (nombre, dataUrl) => writeFileSync(join(dir, nombre), Buffer.from(dataUrl.split(',')[1], 'base64'))
guardar('etiqueta.jpg', datos.etiqueta.imagen)
guardar('capsula.jpg', datos.capsula.imagen)
datos.etiqueta.imagen = `/demo/${id}/etiqueta.jpg`
datos.capsula.imagen = `/demo/${id}/capsula.jpg`
writeFileSync(join(dir, 'botella.json'), JSON.stringify(datos, null, 1))
console.log(`Listo: ${dir}`)
console.log(JSON.stringify(datos.foto))
console.log('etiqueta', datos.etiqueta.desde, '→', datos.etiqueta.hasta, '· cápsula desde', datos.capsula.desde, '· color', datos.capsula.color)
process.exit(0)
