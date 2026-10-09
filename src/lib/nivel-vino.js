// Nivel del vino con volumen constante.
//
// La superficie del vino es un plano (n · p = d) en el espacio de la botella, con n
// apuntando "hacia arriba" según la gravedad. Al inclinar la botella cambia n, y d se
// recalcula para que el volumen por debajo del plano siga siendo el mismo: así el
// vino no "crece" ni "mengua" al inclinarla, y la burbuja de aire viaja hacia el lado
// alto como en una botella real.
//
// El interior se trata como una pila de discos (radio interior a cada altura).

/** Área del disco de radio r que queda en el lado s <= t de una cuerda a distancia t del centro. */
const segmento = (r, t) => (t >= r ? Math.PI * r * r : t <= -r ? 0 : r * r * Math.acos(-t / r) + t * Math.sqrt(r * r - t * t))

/**
 * @param {(y: number) => number} radioEn radio interior a la altura y
 * @param {number} desde altura del fondo interior
 * @param {number} hasta altura del techo interior
 * @param {number} llenado altura del vino con la botella derecha
 * @param {number} [n] número de discos
 */
export function crearNivel(radioEn, desde, hasta, llenado, n = 140) {
  const dy = (hasta - desde) / n
  const ys = new Float64Array(n)
  const rs = new Float64Array(n)
  for (let i = 0; i < n; i++) {
    ys[i] = desde + (i + 0.5) * dy
    rs[i] = Math.max(radioEn(ys[i]), 0)
  }

  /** Volumen de vino bajo el plano n · p <= d (n unitario). */
  function volumen(nx, ny, nz, d) {
    const h = Math.hypot(nx, nz)
    let v = 0
    for (let i = 0; i < n; i++) {
      if (h < 1e-6) {
        if (ny * ys[i] <= d) v += Math.PI * rs[i] * rs[i]
      } else v += segmento(rs[i], (d - ny * ys[i]) / h)
    }
    return v * dy
  }

  const objetivo = volumen(0, 1, 0, llenado)

  /** d que conserva el volumen para la normal (nx, ny, nz), por bisección. */
  function offset(nx, ny, nz) {
    const h = Math.hypot(nx, nz)
    let lo = Infinity
    let hi = -Infinity
    for (let i = 0; i < n; i++) {
      const c = ny * ys[i]
      lo = Math.min(lo, c - rs[i] * h)
      hi = Math.max(hi, c + rs[i] * h)
    }
    for (let k = 0; k < 26; k++) {
      const m = (lo + hi) / 2
      if (volumen(nx, ny, nz, m) < objetivo) lo = m
      else hi = m
    }
    return (lo + hi) / 2
  }

  return { offset, volumen, objetivo }
}
