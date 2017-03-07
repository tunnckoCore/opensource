/*!
 * parse-function <https://github.com/tunnckoCore/parse-function>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

/**
 * Utilities
 */

const utils = require('./lib/utils')

/**
 * Core plugins
 */

const initial = require('./lib/plugins/initial')

/**
 * > Initializes with optional `opts` object which is passed directly
 * to the desired parser and returns an object
 * with `.use` and `.parse` methods. The default parse which
 * is used is [babylon][]'s `.parseExpression` method from `v7`.
 *
 * **Example**
 *
 * ```js
 * const parseFunction = require('parse-function')
 *
 * const app = parseFunction({
 *   ecmaVersion: 2017
 * })
 *
 * const fixtureFn = (a, b, c) => {
 *   a = b + c
 *   return a + 2
 * }
 *
 * const result = app.parse(fixtureFn)
 * console.log(result)
 *
 * // see more
 * console.log(result.name) // => null
 * console.log(result.isNamed) // => false
 * console.log(result.isArrow) // => true
 * console.log(result.isAnonymous) // => true
 *
 * // array of names of the arguments
 * console.log(result.args) // => ['a', 'b', 'c']
 *
 * // comma-separated names of the arguments
 * console.log(result.params) // => 'a, b, c'
 * ```
 *
 * @name   parseFunction
 * @param  {Object} `opts` optional, merged with options passed to `.parse` method
 * @return {Object} `app` object with `.use` and `.parse` methods
 * @api public
 */

module.exports = function parseFunction (opts) {
  const plugins = []
  const app = {
    /**
     * > Define a non-enumerable property on an object. Just
     * a convenience mirror of the [define-property][] library,
     * so check out its docs.
     *
     * @name   .define
     * @param  {Object} `obj` the object on which to define the property
     * @param  {String} `prop` the name of the property to be defined or modified
     * @param  {Any} `val` the descriptor for the property being defined or modified
     * @return {Object} `obj` the passed object, but modified
     * @api public
     */

    define: utils.define,

    /**
     * > Plugin for extending the API or working on the
     * AST nodes. The `fn` is immediately invoked and pass
     * with `app` argument which is instance of `parseFunction()` call.
     * That `fn` may return another function that
     * accepts `(node, result)` signature, where `node` is an AST node
     * and `result` is an object which will be returned
     * from the `.parse` method.
     *
     * @name   .use
     * @param  {Function} `fn` plugin to be called
     * @return {Object} `app` instance for chaining
     * @api public
     */

    use: (fn) => {
      plugins.push(fn(app))
      return app
    },

    /**
     * > Parse a given `code` and returns a `result` object
     * with useful properties - such as `name`, `body` and `args`.
     * By default it uses Babylon parser, but you can switch it by
     * passing `options.parse` - for example `options.parse: acorn.parse`.
     *
     * @name   .parse
     * @param  {Function|String} `code` any kind of function or string to be parsed
     * @param  {Object} `options` directly passed to the parser - babylon, acorn, espree
     * @param  {Function} `options.parse` by default `babylon.parse`,
     *                                    all `options` are passed as second argument
     *                                    to that provided function
     * @return {Object} `result` see [result section](#result) for more info
     * @api public
     */

    parse: (code, options) => {
      let result = utils.setDefaults(code)

      if (!result.isValid) {
        return result
      }

      opts = Object.assign({}, opts, options)

      const isFunction = result.value.startsWith('function')
      const isAsyncFn = result.value.startsWith('async function')

      // eslint-disable-next-line no-useless-escape
      if (isFunction || isAsyncFn || /\=>/.test(result.value)) {
        result.value = result.value
      } else {
        result.value = `{ ${result.value} }`
      }

      let node = utils.getNode(result, opts)

      return plugins.reduce((res, fn) => {
        return fn(node, res) || res
      }, result)
    }
  }

  app.use(initial)

  return app
}
