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

var app = koa().use(betterBody())

test('should parse a json body', function (done) {
  request(app.callback())
    .post('/')
    .send({ foo: 'lol' })
    .expect(200)
    .expect({ foo: 'lol' }, done)
})
test('should parse a string json body', function (done) {
  request(app.callback())
    .post('/')
    .type('application/json')
    .send('{"fao":"nato"}')
    .expect(200)
    .expect({ fao: 'nato' }, done)
})
test('should throw on json non-object body in strict mode (default)', function (done) {
  request(app.callback())
    .post('/')
    .type('json')
    .send('"lol"')
    .expect(400, done)
})
test('should not throw on non-objects in non-strict mode', function (done) {
  var server = koa().use(betterBody({jsonStrict: false}))
  request(server.callback())
    .post('/')
    .type('json')
    .send('"foobar"')
    .expect(200)
    .expect(/foobar/, done)
})
