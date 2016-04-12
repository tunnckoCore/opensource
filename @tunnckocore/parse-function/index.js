/*!
 * parse-function <https://github.com/tunnckoCore/parse-function>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var defineProp = require('define-property')
var acorn = require('acorn/dist/acorn_loose')

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
    return hiddens(defaults(), val, '', false)
  }
  var orig = val
  /* istanbul ignore next */
  if (type === 'function') {
    val = Function.prototype.toString.call(val)
    val = val[0] === 'f' && val[1] === 'u' ? val : 'function ' + val
  }

  return hiddens(walk(val), orig, val, true)
}

function walk (val) {
  var res = {name: 'anonymous', args: [], params: '', body: '', defaults: {}}
  var ast = acorn.parse_dammit(val, {ecmaVersion: 7})
  ast.body.forEach(function (obj) {
    /* istanbul ignore next */
    if (obj.type !== 'ExpressionStatement' && obj.type !== 'FunctionDeclaration') {
      return
    }
    if (obj.type === 'ExpressionStatement' && obj.expression.type === 'ArrowFunctionExpression') {
      obj = obj.expression
    }
    if (obj.type === 'FunctionDeclaration') {
      res.name = obj.id.start === obj.id.end ? 'anonymous' : obj.id.name
    }
    if (!obj.body && !obj.params) {
      return
    }
    if (obj.params.length) {
      obj.params.forEach(function (param) {
        var name = param.left && param.left.name || param.name

        res.args.push(name)
        res.defaults[name] = param.right ? val.slice(param.right.start, param.right.end) : undefined
      })
      res.params = res.args.join(', ')

    // other approach:
    // res.params = val.slice(obj.params[0].start, obj.params[obj.params.length - 1].end)
    // obj.params.forEach(function (param) {
    //   res.args.push(val.slice(param.start, param.end))
    // })
    } else {
      res.params = ''
      res.args = []
    }

    res.body = val.slice(obj.body.start, obj.body.end)
    // clean curly (almost every val, except arrow fns like `(a, b) => a *b`)
    if (res.body.charCodeAt(0) === 123 && res.body.charCodeAt(res.body.length - 1) === 125) {
      res.body = res.body.slice(1, -1)
    }
  })
  return res
}

function defaults () {
  return {
    name: 'anonymous',
    body: '',
    args: [],
    params: ''
  }
}

function hiddens (data, orig, val, valid) {
  defineProp(data, 'orig', orig)
  defineProp(data, 'value', val)
  defineProp(data, 'arguments', data.args)
  defineProp(data, 'parameters', data.params)
  defineProp(data, 'valid', valid)
  defineProp(data, 'invalid', !valid)
  defineProp(data, 'defaults', data.defaults)
  return data
}
