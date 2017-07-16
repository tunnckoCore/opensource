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

test('should catch errors through `options.onerror`', function (done) {
  var server = koa().use(
    betterBody({
      onerror: function (err, ctx) {
        test.ifError(!err)
        test.strictEqual(err.status, 400)
        ctx.throw('custom error', 422)
      }
    })
  )
  request(server.callback())
    .post('/')
    .type('json')
    .send('"foobar"')
    .expect(422)
    .expect('custom error', done)
})
test('should treat `foo/y-javascript` type as json', function (done) {
  var server = koa().use(
    betterBody({
      extendTypes: {
        json: 'foo/y-javascript'
      }
    })
  )
  server.use(function * () {
    test.strictEqual(typeof this.request.fields, 'object')
    test.strictEqual(this.request.fields.a, 'b')
    this.body = this.request.fields
  })
  request(server.callback())
    .post('/')
    .type('foo/y-javascript')
    .send(JSON.stringify({ a: 'b' }))
    .expect(200)
    .expect({ a: 'b' }, done)
})
test('should get body on `strict:false` and DELETE request with body', function (
  done
) {
  var server = koa()
    .use(betterBody({ strict: false }))
    .use(function * postBody () {
      this.body = this.request.fields
    })
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
test('should accept opts.extendTypes.custom `foo/bar-x` as text', function (
  done
) {
  var app = koa().use(
    betterBody({
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
    })
  )

  app = app
    .use(function * (next) {
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

test('should parse bodies using custom `opts.querystring` module', function (
  done
) {
  var app = koa().use(
    betterBody({
      querystring: require('qs')
    })
  )
  app.use(function * () {
    test.strictEqual(typeof this.request.fields, 'object')
    test.deepEqual(this.request.fields, { a: { b: { c: '1' } }, c: '2' })
    this.body = JSON.stringify(this.request.fields)
  })
  request(app.callback())
    .post('/')
    .type('application/x-www-form-urlencoded')
    .send('a[b][c]=1&c=2')
    .expect(/{"a":{"b":{"c":"1"/)
    .expect(/"c":"2"}/)
    .expect(200, done)
})
