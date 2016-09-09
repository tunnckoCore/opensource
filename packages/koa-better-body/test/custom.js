/*!
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 *
 * Copyright (c) 2014-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var betterBody = require('../index')
var request = require('supertest')
var test = require('mukla')
var koa = require('koa')

test('should accept opts.extendTypes.custom `foo/bar-x` as text', function (done) {
  var app = koa().use(betterBody({
    extendTypes: {
      custom: ['foo/bar-x']
    },
    handler: function * handler (ctx, opts) {
      test.strictEqual(typeof ctx, 'object')
      test.strictEqual(typeof this, 'object')
      test.strictEqual(typeof ctx.request.text, 'function')
      test.strictEqual(typeof this.request.text, 'function')

      this.request.body = yield this.request.text(opts)
    }
  }))

  app = app.use(function * (next) {
    test.strictEqual(typeof this.request.body, 'string')
    test.strictEqual(this.request.body, 'message=lol')
    this.body = this.request.body
    yield * next
  })
  .use(function * () {
    test.strictEqual(this.body, 'message=lol')
  })

  request(app.callback())
    .post('/')
    .type('foo/bar-x')
    .send('message=lol')
    .expect(200)
    .expect('message=lol', done)
})
