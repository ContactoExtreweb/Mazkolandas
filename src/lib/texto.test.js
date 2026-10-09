import { test } from 'node:test'
import assert from 'node:assert/strict'
import { aHTML, slugify, numero, fecha, resumen } from './texto.js'

test('aHTML: párrafos, subtítulos y listas', () => {
  assert.equal(
    aHTML('Hola\nmundo\n\n## Poda\n\n- uno\n- dos'),
    '<p>Hola<br>mundo</p>\n<h2>Poda</h2>\n<ul><li>uno</li><li>dos</li></ul>',
  )
})

test('aHTML: escapa HTML y solo deja enlaces http(s) o internos', () => {
  assert.equal(aHTML('<script>x</script>'), '<p>&lt;script&gt;x&lt;/script&gt;</p>')
  assert.equal(aHTML('[a](javascript:alert(1))'), '<p>[a](javascript:alert(1))</p>')
  assert.equal(aHTML('[a](/cuaderno/)'), '<p><a href="/cuaderno/">a</a></p>')
  assert.match(aHTML('[a](https://x.es)'), /rel="noopener" target="_blank"/)
  assert.equal(aHTML('**ojo**'), '<p><strong>ojo</strong></p>')
})

test('slugify, numero, fecha, resumen', () => {
  assert.equal(slugify('  Vendimia 2026: ¡Año de añada!  '), 'vendimia-2026-ano-de-anada')
  assert.equal(numero(7), '007')
  assert.equal(fecha('2026-09-16'), '16.09.2026')
  assert.equal(fecha(null), '')
  assert.equal(resumen('## Hola  **mundo**'), 'Hola mundo')
  assert.ok(resumen('palabra '.repeat(50)).length <= 155)
})
