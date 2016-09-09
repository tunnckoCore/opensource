/*!
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 *
 * Copyright (c) 2014-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

/**
 * > Robust body parser for [koa][]@1, also works for `koa@2` (with deprecations).
 * Will also work for future `koa@3` with [koa-convert][].
 *
 * **Example**
 *
 * ```js
 * var koa = require('koa')
 * var body = require('koa-better-body')
 * var app = koa()
 *
 * app
 *   .use(body())
 *   .use(function * () {
 *     console.log(this.request.body)    // if buffer or text
 *     console.log(this.request.files)   // if multipart or urlencoded
 *     console.log(this.request.fields)  // if json
 *   })
 *   .listen(8080, function () {
 *     console.log('koa server start listening on port 8080')
 *   })
 * ```
 *
 * @param  {Object} `options` see more on [options section](#options)
 * @return {GeneratorFunction}
 * @api public
 */

module.exports = function koaBetterBody (options) {
  options = utils.defaultOptions(options)

  return function * plugin (next) {
    if (options.strict && !utils.isValid(this.method)) {
      return yield * next
    }

    try {
      utils.setParsers(this, options)
      yield * utils.parseBody(this, options, next)
    } catch (err) {
      if (!options.onerror) throw err
      options.onerror(err, this)
    }

    yield * next
  }
}
