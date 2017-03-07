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
 * @param  {Object} `opts` optional, used merged with options passed to `.parse` method
 * @return {Object} `app` object with `.use` and `.parse` methods
 * @api public
 */

module.exports = (opts) => {
  const plugins = []
  const app = {
    define: utils.define,
    use: (fn) => {
      plugins.push(fn(app))
      return app
    },
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
