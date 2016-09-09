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

test('should parse a urlencoded body', function (done) {
  var app = koa().use(betterBody())
  app.use(function * () {
    test.strictEqual(typeof this.request.fields, 'object')
    test.deepEqual(this.request.fields, { a: 'b', c: 'd' })
    this.body = this.request.fields
  })
  request(app.callback())
    .post('/')
    .type('application/x-www-form-urlencoded')
    .send('a=b&c=d')
    .expect(200)
    .expect(/"a":"b"/)
    .expect(/"c":"d"/, done)
})
test('should throw if the body is too large', function (done) {
  var app = koa().use(betterBody({ formLimit: '2b' }))
  request(app.callback())
    .post('/')
    .type('application/x-www-form-urlencoded')
    .send({ foo: { bar: 'qux' } })
    .expect(413, done)
})
test('should parse a nested body when `app.querystring` passed', function (done) {
  var app = koa()
  app.querystring = require('qs')

  app.use(betterBody({ formLimit: '2mb' }))
  app.use(function * () {
    test.strictEqual(typeof this.request.fields, 'object')
    test.deepEqual(this.request.fields, {
      foo: {
        bar: {
          baz: 'qux',
          cc: 'ccc'
        },
        aa: 'bb'
      }
    })
    this.body = JSON.stringify(this.request.fields)
  })

  request(app.callback())
    .post('/')
    .type('application/x-www-form-urlencoded')
    .send('foo[bar][baz]=qux&foo[bar][cc]=ccc&foo[aa]=bb')
    .expect(/"foo":{"bar":/)
    .expect(/"baz":"qux","cc":"ccc"}/)
    .expect(/"aa":"bb"}}/)
    .expect(200, done)
})
