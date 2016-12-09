/*!
 * parse-function <https://github.com/tunnckoCore/parse-function>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (http://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

const babylon = require('babylon')
const define = require('define-property')

/**
 * > Parse a function or string that contains a function,
 * using [babylon][] or [acorn][] parsers.
 * By default it uses `babylon`, but you can pass custom one
 * through `options.parse` option - for example pass `.parse: acorn.parse`
 * to force use the `acorn` parser instead.
 *
 * **Example**
 *
 * ```js
 * const acorn = require('acorn')
 * const acornLoose = require('acorn/dist/acorn_loose')
 * const parseFunction = require('parse-function')
 *
 * const myFn = function abc (e, f, ...rest) { return 1 + e + 2 + f }
 * const parsed = parseFunction(myFn)
 *
 * console.log(parsed.name) // => 'abc'
 * console.log(parsed.body) // => ' return 1 + e + 2 + f '
 * console.log(parsed.args) // => [ 'e', 'f', 'rest' ]
 * console.log(parsed.params) // => 'e, f, rest'
 *
 * // some useful `is*` properties
 * console.log(parsed.isValid) // => true
 * console.log(parsed.isNamed) // => true
 * console.log(parsed.isArrow) // => false
 * console.log(parsed.isAnonymous) // => false
 * console.log(parsed.isGenerator) // => false
 *
 * // use `acorn` parser
 * const someArrow = (foo, bar) => 1 * foo + bar
 * const result = parseFunction(someArrow, {
 *   parser: acorn.parse,
 *   ecmaVersion: 2017
 * })
 *
 * console.log(result.name) // => 'anonymous'
 * console.log(result.body) // => '1 * foo + bar'
 * console.log(result.args) // => [ 'foo', 'bar' ]
 *
 * console.log(result.isValid) // => true
 * console.log(result.isArrow) // => true
 * console.log(result.isNamed) // => false
 * console.log(result.isAnonymous) // => true
 * ```
 *
 * @param  {Function|String} `code` function to be parsed, it can be string too
 * @param  {Object} `options` optional, passed directly to [babylon][] or [acorn][]
 * @param  {Function} `options.parse` custom parse function passed with `code` and `options`
 * @return {Object} always returns an object, see [result section](#result)
 * @api public
 */

module.exports = function parseFunction (code, options) {
  let result = getDefaults(code)

  if (!result.isValid) {
    return result
  }
  options = options && typeof options === 'object' ? options : {}
  options.parse = typeof options.parse === 'function'
    ? options.parse
    : babylon.parse

  const ast = options.parse(result.value, options)
  const body = ast.program && ast.program.body ? ast.program.body : ast.body

  body.forEach((node) => {
    /* istanbul ignore next */
    if (node.type !== 'ExpressionStatement' && node.type !== 'FunctionDeclaration') {
      return
    }

    node = update(node, result)
    node = visitArrows(node, result)
    node = visitFunctions(node, result)

    if (!node.body && !node.params) {
      return
    }

    result = visitParams(node, result)
    result = fixBody(node, result)
  })

  result = fixName(result)
  return result
}

/**
 * > Create default result object,
 * and normalize incoming arguments.
 *
 * @param  {Function|String} `code`
 * @return {Object} result
 * @api private
 */

function getDefaults (code) {
  const result = {
    name: 'anonymous',
    body: '',
    args: [],
    params: ''
  }

  code = typeof code === 'function' ? code.toString('utf8') : code
  code = typeof code === 'string'
    ? code.replace(/function *\(/, 'function ____foo$1o__i3n8v$al4i1d____(')
    : false

  return hiddens(result, code)
}

/**
 * > Create hidden properties into
 * the result object.
 *
 * @param  {Object} `result`
 * @param  {Function|String} code
 * @return {Object} result
 * @api private
 */

function hiddens (result, code) {
  define(result, 'defaults', {})
  define(result, 'value', code || '')
  define(result, 'isValid', code && code.length > 0)
  define(result, 'isArrow', false)
  define(result, 'isAsync', false)
  define(result, 'isNamed', false)
  define(result, 'isAnonymous', false)
  define(result, 'isGenerator', false)
  define(result, 'isExpression', false)

  return result
}

/**
 * > Update the result object with some
 * useful information like is given function
 * is async, generator or it is a FunctionExpression.
 *
 * @param  {Object} `node`
 * @param  {Object} `result`
 * @return {Object} `node`
 * @api private
 */

function update (node, result) {
  const asyncExpr = node.expression && node.expression.async
  const genExpr = node.expression && node.expression.generator

  define(result, 'isAsync', node.async || asyncExpr || false)
  define(result, 'isGenerator', node.generator || genExpr || false)
  define(result, 'isExpression', !node.expression || false)

  return node
}

/**
 * > Visit each arrow expression.
 *
 * @param  {Object} `node`
 * @param  {Object} `result`
 * @return {Object} `node`
 * @api private
 */
function visitArrows (node, result) {
  const isArrow = node.expression.type === 'ArrowFunctionExpression'

  if (node.type === 'ExpressionStatement' && isArrow) {
    define(result, 'isArrow', true)
    node = node.expression
  }

  return node
}

/**
 * > Visit each function declaration.
 *
 * @param  {Object} `node`
 * @param  {Object} `result`
 * @return {Object} `node`
 * @api private
 */
function visitFunctions (node, result) {
  if (node.type === 'FunctionDeclaration') {
    result.name = node.id.name
  }

  return node
}

/**
 * > Visit each of the params in the
 * given function.
 *
 * @param  {Object} `node`
 * @param  {Object} `result`
 * @return {Object} `result`
 * @api private
 */
function visitParams (node, result) {
  if (node.params.length) {
    node.params.forEach(function (param) {
      const defaultArgsName = param.type === 'AssignmentPattern' &&
        param.left &&
        param.left.name

      const restArgName = param.type === 'RestElement' &&
        param.argument &&
        param.argument.name

      const name = param.name || defaultArgsName || restArgName

      result.args.push(name)
      result.defaults[name] = param.right
        ? result.value.slice(param.right.start, param.right.end)
        : undefined
    })
    result.params = result.args.join(', ')
    return result
  }

  result.params = ''
  result.args = []
  return result
}

/**
 * > Gets the raw body, without the
 * surrounding curly braces. It also preserves
 * the whitespaces and newlines - they are original.
 *
 * @param  {Object} `node`
 * @param  {Object} `result`
 * @return {Object} `result`
 * @api private
 */

function fixBody (node, result) {
  result.body = result.value.slice(node.body.start, node.body.end)

  const openCurly = result.body.charCodeAt(0) === 123
  const closeCurly = result.body.charCodeAt(result.body.length - 1) === 125

  if (openCurly && closeCurly) {
    result.body = result.body.slice(1, -1)
  }

  return result
}

/**
 * > Tweak the names. Each anonymous function
 * initially are renamed to some unique name
 * and it is restore to be `anonymous`.
 *
 * @param  {Object} `result`
 * @return {Object} `result`
 * @api private
 */

function fixName (result) {
  // tweak throwing if anonymous function
  const isAnon = result.name === '____foo$1o__i3n8v$al4i1d____'
  result.name = isAnon ? 'anonymous' : result.name

  // more checking stuff
  define(result, 'isAnonymous', result.name === 'anonymous')
  define(result, 'isNamed', result.name !== 'anonymous')

  return result
}
