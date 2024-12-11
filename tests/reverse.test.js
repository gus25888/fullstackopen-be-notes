const { test, describe } = require('node:test')
const assert = require('node:assert')

const reverse = require('../utils/for_testing').reverse

describe('reverse', { skip: true }, () => {
  test('reverse of a', () => {
    const result = reverse('a')

    assert.strictEqual(result, 'a')
  })

  test('reverse of react', () => {
    const result = reverse('react')

    //Resultado de prueba incorrecto
    // assert.strictEqual(result, 'tkaer')

    //Resultado de prueba correcto
    assert.strictEqual(result, 'tcaer')
  })

  test('reverse of saippuakauppias', () => {
    const result = reverse('saippuakauppias')

    assert.strictEqual(result, 'saippuakauppias')
  })
})
