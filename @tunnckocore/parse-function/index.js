/*!
 * parse-function <https://github.com/tunnckoCore/parse-function>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var defineProp = require('define-property')

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
module.exports = function parseFunction (val) {
  var type = typeof val
  if (type !== 'string' && type !== 'function') {
    return {}
  }
  var orig = val
  if (type === 'function') {
    val = Function.prototype.toString.call(val)
  }

  var data = walk(val)
  defineProp(data, 'orig', orig)
  defineProp(data, 'value', val)
  defineProp(data, 'arguments', data.args)
  defineProp(data, 'parameters', data.params)

  return data
}

var SPACE = 32 // ` `
var GREATER_THAN = 62 // `>`
var OPEN_PAREN = 40 // `(`
var CLOSE_PAREN = 41 // `)`
var OPEN_CURLY = 123 // `{`
var CLOSE_CURLY = 125 // `}`

/**
 * String walker
 *
 * @param  {String} `str`
 * @return {Object}
 */
function walk (str) {
  if (typeof str !== 'string') {
    return {}
  }
  str = str.replace('){', ') {') // tweak
  var i = 0
  var j = 0
  var len = str.length
  var parts = ['']
  var info = {hasParen: false, hasCurly: false, hasArrow: false}

  while (i < len) {
    var key = str[i]
    var ch = key.charCodeAt(0)
    if (ch === GREATER_THAN) {
      info.hasArrow = true
      info.startArrow = info.startArrow || j
    }
    if (ch === OPEN_CURLY) {
      info.hasCurly = true
      info.openCurly = info.openCurly || i
      info.startCurly = info.startCurly || j
    }
    if (ch === CLOSE_CURLY) {
      info.closeCurly = info.closeCurly || i
      info.endCurly = info.endCurly || j
    }
    if (ch === OPEN_PAREN) {
      info.hasParen = true
      info.openParen = info.openParen || i
      info.startParen = info.startParen || j
    }
    if (ch === CLOSE_PAREN) {
      info.closeParen = info.closeParen || i
      info.endParen = info.endParen || j + 1
    }
    if (ch === SPACE) {
      info.firstSpace = info.firstSpace || i
      parts.push(' ')
      j++
    } else {
      parts[j] += key
    }
    i++
  }
  info._value = str
  info = build(info, parts)
  return info
}

/**
 * Build needed object from info
 *
 * @param  {Object} `info`
 * @param  {Array} `parts`
 * @return {Object}
 */
function build (info, parts) {
  var data = {}

  if (info.hasParen) {
    if (info.startParen >= 1) {
      var last = info.openParen - parts[info.startParen - 1].length
      data.name = parts[1].slice(1, last)
    } else {
      data.name = info.hasArrow ? 'anonymous' : parts[1].trim()
    }
    if (info.startParen === 0) {
      data.name = 'anonymous'
    }
    data.name = data.name.length && data.name || 'anonymous'
  } else {
    data.name = data.name || 'anonymous'
    data.params = parts[0]
    data.args = [parts[0]]
  }
  if (info.hasArrow) {
    data.body = parts.slice(info.startArrow + 1).join('').trim()
    data.body = info.hasCurly ? data.body.slice(1, -1) : data.body

    if (info.hasParen) {
      data.params = parts.slice(0, info.startArrow).join('').slice(1, -1)
      data.args = data.params.split(/\,\s*/).filter(Boolean)
    }
  } else {
    data.body = parts.slice(info.startCurly).join('').trim().slice(1, -1)
    data.params = info._value.slice(info.openParen + 1, info.closeParen)
    data.args = data.params.split(/\,\s*/).filter(Boolean)
  }

  return data
}
