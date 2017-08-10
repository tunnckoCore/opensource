'use strict'

const espree = require('espree')
const parseFn = require('../../index')

module.exports = function usingAcorn(code) {
  return parseFn(code, {
    parse: espree.parse,
    ecmaVersion: 8,
  })
}
