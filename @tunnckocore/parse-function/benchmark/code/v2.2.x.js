/*!
 * parse-function <https://github.com/tunnckoCore/parse-function>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

let defineProp = require('define-property')

/**
 * Parse function, arrow function or string to object.
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
 * //   body: ' callback(null, a + b) ',
 * //   params: 'a, b, callback',
 * //   args: ['a', 'b', 'callback']
 * // }
 *
 * const withoutName = function (x, y) {}
 * const res = parseFunction(withoutName)
 * // => {
 * //   name: 'anonymous',
 * //   body: '',
 * //   params: 'x, y',
 * //   args: ['x', 'y']
 * // }
 * ```
 *
 * @name parseFunction
 * @param  {Function|ArrowFunction|String} `[val]` function or string to parse
 * @return {Object} with `name`, `args`, `params` and `body` properties
 * @api public
 */
module.exports = function parseFunction(val) {
  let type = typeof val
  if (type !== 'string' && type !== 'function') {
    return hiddens(defaults(), val, '', false)
  }
  let orig = val
  /* istanbul ignore next */
  if (type === 'function') {
    val = Function.prototype.toString.call(val)
  }

  return hiddens(parseFn(val), orig, val, true)
}

function parseFn(val) {
  let re = /(?:function\s*([\w$]*)\s*)*\(*([\w\s,$]*)\)*(?:[\s=>]*)([\s\S]*)/
  let match = re.exec(val)

  let params = match[2] && match[2].length ? match[2].replace(/\s$/, '') : ''
  let args = (params.length && params.replace(/\s/g, '').split(',')) || []
  let body = getBody(match[3] || '') || ''

  return {
    name: match[1] || 'anonymous',
    body: body,
    args: args,
    params: params,
  }
}

function getBody(a) {
  let len = a.length - 1
  if (a.charCodeAt(0) === 123 && a.charCodeAt(len) === 125) {
    return a.slice(1, -1)
  }
  let m = /^\{([\s\S]*)\}[\s\S]*$/.exec(a)
  return m ? m[1] : a
}

function defaults() {
  return {
    name: 'anonymous',
    body: '',
    args: [],
    params: '',
  }
}

function hiddens(data, orig, val, valid) {
  defineProp(data, 'orig', orig)
  defineProp(data, 'value', val)
  defineProp(data, 'arguments', data.args)
  defineProp(data, 'parameters', data.params)
  defineProp(data, 'valid', valid)
  defineProp(data, 'invalid', !valid)
  return data
}
