/*!
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 *
 * Copyright (c) 2014-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var betterBody = require('../index')
var request = require('supertest')
var test = require('assertit')
var koa = require('koa')

test('should catch errors through `options.onerror`', function (done) {
  var server = koa().use(betterBody({
    onerror: function (err, ctx) {
      test.ifError(!err)
      test.strictEqual(err.status, 400)
      ctx.throw('custom error', 422)
    }
  }))
  request(server.callback())
    .post('/')
    .type('json')
    .send('"foobar"')
    .expect(422)
    .expect('custom error', done)
})
test('should treat `foo/y-javascript` type as json', function (done) {
  var server = koa().use(betterBody({
    extendTypes: {
      json: 'foo/y-javascript'
    }
  }))
  server.use(function * () {
    test.strictEqual(typeof this.request.fields, 'object')
    test.strictEqual(this.request.fields.a, 'b')
  })
  request(server.callback())
    .post('/')
    .type('foo/y-javascript')
    .send(JSON.stringify({ a: 'b' }))
    .expect(200)
    .expect({a: 'b'}, done)
})
test('should get body on `strict:false` and DELETE request with body', function (done) {
  var server = koa().use(betterBody({strict: false}))
  request(server.callback())
    .delete('/')
    .type('json')
    .send({ abc: 'foo' })
    .expect(200)
    .expect({ abc: 'foo' }, done)
})
test('should not get body on DELETE request (on strict mode)', function (done) {
  var server = koa().use(betterBody())
  server.use(function * () {
    test.strictEqual(this.body, undefined)
    test.strictEqual(this.request.fields, undefined)
    this.status = 204
  })
  request(server.callback())
    .delete('/')
    .type('text')
    .send('foo bar')
    .expect(204, done)
})
