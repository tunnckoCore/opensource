/*!
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 *
 * Copyright (c) 2014-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var betterBody = require('../index')
var isBuffer = require('is-buffer')
var request = require('supertest')
var test = require('mukla')
var koa = require('koa')

test('should get the raw buffer body (options.buffer: true)', function (done) {
  var server = koa().use(betterBody({ buffer: true }))
  server.use(function * () {
    test.strictEqual(isBuffer(this.request.body), true)
    this.body = this.request.body.toString('utf8')
  })
  request(server.callback())
    .post('/')
    .type('text')
    .send('qux')
    .expect(200)
    .expect('qux', done)
})
test('should throw if the buffer body is too large (options.buffer: true)', function (done) {
  var server = koa().use(betterBody({ buffer: true, bufferLimit: '2b' }))
  request(server.callback())
    .post('/')
    .type('text')
    .send('too large')
    .expect(413, done)
})
test('should get json if `options.buffer` is false (that is the default)', function (done) {
  var server = koa().use(betterBody())
  server.use(function * () {
    test.strictEqual(typeof this.request.fields, 'object')
    test.deepEqual(this.request.fields, { 'too large': '' })
    this.body = this.request.fields
  })
  request(server.callback())
    .post('/')
    .send('too large')
    .expect(200)
    .expect(/"too large":/, done)
})
