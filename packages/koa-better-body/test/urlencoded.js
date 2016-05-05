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
  var server = koa().use(betterBody())
  server.use(function * () {
    test.strictEqual(typeof this.request.fields, 'object')
    test.strictEqual(typeof this.body, 'object')
    test.deepEqual(this.body, {a: 'b', c: 'd'})
    test.deepEqual(this.request.fields, {a: 'b', c: 'd'})
  })
  request(server.callback())
    .post('/')
    .type('application/x-www-form-urlencoded')
    .send('a=b&c=d')
    .expect(200)
    .expect(/"a":"b"/)
    .expect(/"c":"d"/, done)
})
test('should throw if the body is too large', function (done) {
  var server = koa().use(betterBody({formLimit: '2b'}))
  request(server.callback())
    .post('/')
    .type('application/x-www-form-urlencoded')
    .send({ foo: { bar: 'qux' } })
    .expect(413, done)
})
