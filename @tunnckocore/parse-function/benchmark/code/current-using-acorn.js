'use strict'

const acorn = require('acorn')
const parseFn = require('../../index')

module.exports = function usingAcorn(code) {
  return parseFn(code, {
    parse: acorn.parse,
    ecmaVersion: 2017,
  })
}
