/*!
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 *
 * Copyright (c) 2014-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

import { defaultOptions, setParsers, isValid, parseBody } from './utils';

/**
 * > Robust body parser for [koa][]@1, also works for `koa@2` (with deprecations).
 * Will also work for future `koa@3` with [koa-convert][].
 *
 * @example
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
 *
 * @name   koaBetterBody
 * @param  {Object} `options` see more on [options section](#options)
 * @return {GeneratorFunction} - plugin for Koa
 * @api public
 */

export default function koaBetterBody(options) {
  const opts = defaultOptions(options);

  // eslint-disable-next-line consistent-return
  return function* plugin(next) {
    if (opts.strict && !isValid(this.method)) {
      return yield* next;
    }

    try {
      setParsers(this, opts);
      yield* parseBody(this, opts, next);
    } catch (err) {
      if (!opts.onError) throw err;
      opts.onError(err, this);
    }

    yield* next;
  };
}
