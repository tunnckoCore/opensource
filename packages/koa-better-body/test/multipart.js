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
var path = require('path')
var koa = require('koa')

function filepath (name) {
  return path.join(__dirname, '../', name)
}

test('should not get multipart body if options.multipart: false', function (done) {
  var server = koa().use(betterBody({ multipart: false }))
  server.use(function * () {
    test.strictEqual(this.body, undefined)
    test.strictEqual(this.request.fields, undefined)
    test.strictEqual(this.request.files, undefined)
    this.body = 'abc'
  })
  request(server.callback())
    .post('/')
    .type('multipart/form-data')
    .attach('foo', filepath('package.json'))
    .expect(200)
    .expect('abc', done)
})
test('should get multipart body by default', function (done) {
  var server = koa().use(betterBody())
  server.use(function * () {
    test.deepEqual(this.body.files, this.request.files)
    test.strictEqual(this.body.files.foo.name, 'LICENSE')
    test.strictEqual(this.body.files.bar.name, 'utils.js')
  })
  request(server.callback())
    .post('/')
    .type('multipart/form-data')
    .attach('foo', filepath('LICENSE'))
    .attach('bar', filepath('utils.js'))
    .expect(200, done)
})
test('should get multipart files and fields', function (done) {
  var server = koa().use(betterBody())
  server.use(function * () {
    test.deepEqual(this.body.files, this.request.files)
    test.strictEqual(this.body.files.pkg.name, 'package.json')
    test.strictEqual(this.body.a, 'b')
    test.strictEqual(this.request.fields.a, 'b')
  })
  request(server.callback())
    .post('/')
    .type('multipart/form-data')
    .field('a', 'b')
    .attach('pkg', filepath('package.json'))
    .expect(200, done)
  done()
})
test('should get multiple files on same field name', function (done) {
  var server = koa().use(betterBody())
  server.use(function * () {
    test.strictEqual(this.body.files.pkg[0].name, 'package.json')
    test.strictEqual(this.body.files.pkg[1].name, 'utils.js')
  })
  request(server.callback())
    .post('/')
    .type('multipart/form-data')
    .attach('pkg', filepath('package.json'))
    .attach('pkg', filepath('utils.js'))
    .expect(200, done)
})
test('should get multiple fields on same field name', function (done) {
  var server = koa().use(betterBody())
  server.use(function * () {
    test.deepEqual(this.body.foo, ['bar', 'baz'])
    test.strictEqual(this.body.baz, 'qux')
  })
  request(server.callback())
    .post('/')
    .type('multipart/form-data')
    .field('foo', 'bar')
    .field('foo', 'baz')
    .field('baz', 'qux')
    .expect(200, done)
})
test('should not conflicts between fields and files', function (done) {
  var server = koa().use(betterBody())
  server.use(function * () {
    test.strictEqual(this.request.files.pkg[0].name, 'package.json')
    test.strictEqual(this.request.files.pkg[1].name, 'utils.js')
    test.strictEqual(this.request.fields.pkg, 'foo')
    test.deepEqual(this.request.fields.aaa, ['bbb', 'ddd'])
  })
  request(server.callback())
    .post('/')
    .type('multipart/form-data')
    .attach('pkg', filepath('package.json'))
    .attach('pkg', filepath('utils.js'))
    .field('pkg', 'foo')
    .field('aaa', 'bbb')
    .field('aaa', 'ddd')
    .expect(200, done)
})
