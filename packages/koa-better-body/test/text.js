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

var app = koa().use(betterBody())

test('should get the raw text body', function (done) {
  app.use(function * () {
    test.strictEqual(this.request.fields, undefined)
    test.strictEqual(typeof this.body, 'string')
    test.strictEqual(this.body, 'message=lol')
  })
  request(app.callback())
    .post('/')
    .type('text')
    .send('message=lol')
    .expect(200)
    .expect('message=lol', done)
})
test('should throw if the body is too large', function (done) {
  var server = koa().use(betterBody({textLimit: '2b'}))
  request(server.callback())
    .post('/')
    .type('text')
    .send('foobar')
    .expect(413, done)
})
