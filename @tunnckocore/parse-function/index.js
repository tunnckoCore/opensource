/*!
 * parse-function <https://github.com/tunnckoCore/parse-function>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (http://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

const arrayify = require('arrify')
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
 * const acorn = require('acorn')
 * const someArrow = (foo, bar) => 1 * foo + bar
 * const result = parseFunction(someArrow, {
 *   parse: acorn.parse,
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
 *
 * // or use "loose mode" of the acorn parser
 * const acornLoose = require('acorn/dist/acorn_loose')
 * const fooBarFn = async (a, b, ...c) => {
 *   return Promise.resolve([a, b].concat(c))
 * }
 * const res = parseFunction(fooBarFn, {
 *   parse: acornLoose.parse_dammit
 * })
 *
 * console.log(res.body) // => '\n  return Promise.resolve([a, b].concat(c))\n'
 * console.log(res.args) // => ['a', 'b', 'c']
 * console.log(res.isValid) // => true
 * console.log(res.isAsync) // => true
 * console.log(res.isArrow) // => true
 * console.log(res.isNamed) // => false
 * console.log(res.isAnonymous) // => true
 * ```
 *
 * @param  {Function|String} `code` function to be parsed, it can be string too
 * @param  {Object} `options` optional, passed directly to [babylon][] or [acorn][]
 * @param  {Function} `options.parse` custom parse function passed with `code` and `options`
 * @return {Object} always returns an object, see [result section](#result)
 * @api public
 */

module.exports = function parseFunction (code, options) {
  let result = setDefaults(code)

  if (!result.isValid) {
    return result
  }

  const opts = Object.assign({}, options)
  opts.use = [defaultPlugin].concat(arrayify(opts.use))

  let val = result.value
  let starts = val.startsWith('function') || val.startsWith('async function')

  if (starts || /\=>/.test(val)) { // eslint-disable-line no-useless-escape
    result.value = val
  } else {
    result.value = `{ ${val} }`
  }

  let node = getNode(result, opts)

  return opts.use.reduce((res, plugin) => {
    return plugin(node, res) || res
  }, result)
}

/**
 * > Create default result object,
 * and normalize incoming arguments.
 *
 * @param  {Function|String} `code`
 * @return {Object} result
 * @api private
 */

function setDefaults (code) {
  const result = {
    name: null,
    body: '',
    args: [],
    params: ''
  }

  if (typeof code === 'function') {
    code = code.toString('utf8')
  }

  if (typeof code !== 'string') {
    code = '' // makes result.isValid === false
  }

  return setHiddenDefaults(result, code)
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

function setHiddenDefaults (result, code) {
  define(result, 'defaults', {})
  define(result, 'value', code)
  define(result, 'isValid', code.length > 0)
  define(result, 'isArrow', false)
  define(result, 'isAsync', false)
  define(result, 'isNamed', false)
  define(result, 'isAnonymous', false)
  define(result, 'isGenerator', false)
  define(result, 'isExpression', false)

  return result
}

/**
 * > Get needed AST tree, depending on what
 * parse method is used.
 *
 * @param  {Object} `result`
 * @param  {Object} `opts`
 * @return {Object} `node`
 * @api private
 */

function getNode (result, opts) {
  if (typeof opts.parse === 'function') {
    result.value = `( ${result.value} )`

    const ast = opts.parse(result.value, opts)
    const body = ast.program && ast.program.body || ast.body

    return body[0].expression
  }

  return babylon.parseExpression(result.value, opts)
}

/**
 * > Default plugin to handle functions. It has two
 * child "micro plugins" - one for collecting
 * the params/arguments, and second one to get
 * the actual function body - preserving the
 * whitespaces and newlines.
 *
 * @param  {Object} `node`
 * @param  {Object} `result`
 * @return {Object} `result`
 * @api private
 */

function defaultPlugin (node, result) {
  const isFn = node.type.endsWith('FunctionExpression')
  const isMethod = node.type === 'ObjectExpression'

  // only if function, arrow function,
  // generator function or object method

  /* istanbul ignore next */
  if (!isFn && !isMethod) {
    return
  }

  node = isMethod ? node.properties[0] : node
  node.id = isMethod ? node.key : node.id

  // babylon node.properties[0] is `ObjectMethod` that has `params` and `body`;
  // acorn node.properties[0] is `Property` that has `value`;
  if (node.type === 'Property') {
    var id = node.key
    node = node.value
    node.id = id
  }

  // kind of micro plugins
  result = setProps(node, result)
  result = getParams(node, result)
  result = getBody(node, result)

  return result
}

/**
 * > Set couple of hidden properties and
 * the name of the given function to
 * the returned result object
 *
 * @param  {Object} `node`
 * @param  {Object} `result`
 * @return {Object} `result`
 * @api private
 */

function setProps (node, result) {
  define(result, 'isArrow', node.type.startsWith('Arrow'))
  define(result, 'isAsync', node.async || false)
  define(result, 'isGenerator', node.generator || false)
  define(result, 'isExpression', node.expression || false)
  define(result, 'isAnonymous', node.id === null)
  define(result, 'isNamed', !result.isAnonymous)

  // if real anonymous -> set to null,
  // notice that you can name you function `anonymous`, haha
  // and it won't be "real" anonymous, so `isAnonymous` will be `false`
  result.name = result.isAnonymous ? null : node.id.name

  return result
}

/**
 * > Micro plugin to visit each of the params
 * in the given function.
 *
 * @param  {Object} `node`
 * @param  {Object} `result`
 * @return {Object} `result`
 * @api private
 */

function getParams (node, result) {
  if (!node.params.length) {
    return result
  }

  node.params.forEach((param) => {
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

/**
 * > Micro plugin to get the raw body, without the
 * surrounding curly braces. It also preserves
 * the whitespaces and newlines - they are original.
 *
 * @param  {Object} `node`
 * @param  {Object} `result`
 * @return {Object} `result`
 * @api private
 */

function getBody (node, result) {
  result.body = result.value.slice(node.body.start, node.body.end)

  const openCurly = result.body.charCodeAt(0) === 123
  const closeCurly = result.body.charCodeAt(result.body.length - 1) === 125

  if (openCurly && closeCurly) {
    result.body = result.body.slice(1, -1)
  }

  return result
}
