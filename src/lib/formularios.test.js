import { test } from 'node:test'
import assert from 'node:assert/strict'
import { emailValido, nombreSospechoso, mensajeSospechoso, trampaBot } from './formularios.js'

test('email', () => {
  assert.ok(emailValido('nerea@ejemplo.es'))
  assert.ok(!emailValido('nerea@ejemplo'))
  assert.ok(!emailValido(''))
})

test('nombre sospechoso', () => {
  assert.ok(!nombreSospechoso('Iñaki Pérez'))
  assert.ok(nombreSospechoso('czQUDEldAeDbtCisHbxVjgV'))
  assert.ok(nombreSospechoso('http://spam.com'))
  assert.ok(nombreSospechoso('a'))
})

test('mensaje sospechoso', () => {
  assert.ok(!mensajeSospechoso('Hola, ¿cuándo sale el vino? Os vi en https://instagram.com'))
  assert.ok(mensajeSospechoso('mira https://a.com y https://b.com'))
  assert.ok(mensajeSospechoso('<a href="x">x</a>'))
})

test('trampa de bots', () => {
  assert.equal(trampaBot({ empresa: 'ACME', ts: Date.now() - 10000 }), 'honeypot')
  assert.match(trampaBot({ ts: Date.now() - 500 }), /enviado en/)
  assert.equal(trampaBot({}), 'sin marca de tiempo')
  assert.equal(trampaBot({ ts: Date.now() - 10000 }), null)
})
