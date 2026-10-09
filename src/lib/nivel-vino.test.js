import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearNivel } from './nivel-vino.js'

// Cilindro de radio 1 y altura 2, lleno hasta la mitad
const nivel = crearNivel(() => 1, 0, 2, 1, 400)
const cerca = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) < tol, `${a} ≉ ${b}`)

test('derecha: el volumen es el del cilindro hasta el nivel', () => {
  cerca(nivel.objetivo, Math.PI)
  cerca(nivel.offset(0, 1, 0), 1)
})

test('inclinada 45°: el plano pasa por el centro (mitad del volumen, por simetría)', () => {
  const s = Math.SQRT1_2
  cerca(nivel.offset(s, s, 0), s) // n · (0, 1, 0) = cos 45°
})

test('el volumen se conserva al inclinar', () => {
  for (const ang of [0.2, 0.6, 1.0]) {
    const n = [Math.sin(ang), Math.cos(ang), 0]
    const d = nivel.offset(...n)
    cerca(nivel.volumen(...n, d), nivel.objetivo, 0.005)
  }
})
