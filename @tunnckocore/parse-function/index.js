/*!
 * parse-function <https://github.com/tunnckoCore/parse-function>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var fnRegex = require('function-regex')

/**
 * Parse a given function or string to object.
 *
 * **Example**
 *
 * ```js
 * const parseFunction = require('parse-function')
 *
 * const fixture = 'function testing (a, b, callback) { callback(null, a + b) }'
 * const obj = parseFunction(fixture)
 * // => {
 * //   name: 'testing',
 * //   params: 'a, b, callback',
 * //   parameters: 'a, b, callback',
 * //   args: ['a', 'b', 'callback'],
 * //   arguments: ['a', 'b', 'callback'],
 * //   body: ' callback(null, a + b) '
 * // }
 *
 * const withoutName = function (x, y) {}
 * const res = parseFunction(withoutName)
 * // => {
 * //   name: 'anonymous',
 * //   params: 'x, y',
 * //   parameters: 'x, y',
 * //   args: ['x', 'y'],
 * //   arguments: ['x', 'y'],
 * //   body: ''
 * // }
 * ```
 *
 * @name parseFunction
 * @param  {Function|String} `[fn]` function or string to parse
 * @return {Object} with `name`, `args`, `params` and `body` properties
 * @api public
 */
module.exports = function parseFunction (fn) {
  if (typeof fn === 'function') {
    fn = fn.toString()
  }
  var match = fnRegex().exec(fn)

  var _parameters = match[2] || ''
  var _arguments = match[2].length && match[2].replace(/\s/g, '').split(',') || []

  return {
    name: match[1] || 'anonymous',
    params: _parameters,
    parameters: _parameters,
    args: _arguments,
    arguments: _arguments,
    body: match[3] || ''
  }
}
