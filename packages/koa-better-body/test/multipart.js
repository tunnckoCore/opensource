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
    test.ok(this.request.files)
    // possible fails, because it not respect order, it's async
    // test.strictEqual(this.request.files[0].name, 'LICENSE')
    // test.strictEqual(this.request.files[1].name, 'README.md')
    // test.strictEqual(this.request.files[2].name, 'utils.js')
    // test.strictEqual(this.request.fields.foo[0].name, 'LICENSE')
    // test.strictEqual(this.request.fields.foo[1].name, 'README.md')
    // test.strictEqual(this.request.fields.bar[0].name, 'utils.js')
    test.strictEqual(this.request.files.length, 3, 'should be 3 files')
    test.strictEqual(this.request.fields.foo.length, 2, 'should fields.foo to have 2 files')
    test.strictEqual(this.request.fields.bar.length, 1, 'should fields.bar to have 1 file')
    this.body = 'ok1'
  })
  request(server.callback())
    .post('/')
    .type('multipart/form-data')
    .attach('foo', filepath('LICENSE'))
    .attach('foo', filepath('README.md'))
    .attach('bar', filepath('utils.js'))
    .expect(200)
    .expect('ok1', done)
})
test('should get multipart files and fields', function (done) {
  var server = koa().use(betterBody())
  server.use(function * () {
    test.ok(this.request.files)
    test.ok(this.request.fields)
    test.strictEqual(this.request.files[0].name, 'package.json')
    test.strictEqual(this.request.fields.a, 'b')
    test.strictEqual(this.request.fields.pkg[0].name, 'package.json')
    this.body = 'ok1'
  })
  request(server.callback())
    .post('/')
    .type('multipart/form-data')
    .field('a', 'b')
    .attach('pkg', filepath('package.json'))
    .expect(200, done)
})

test('should escape ampersand on multipart form', function (done) {
  var server = koa().use(betterBody())
  server.use(function * () {
    test.ok(this.request.fields)
    test.deepEqual(this.request.fields.a, 'B&W')
    this.body = 'ok13'
  })
  request(server.callback())
    .post('/')
    .type('multipart/form-data')
    .field('a', 'B&W')
    .expect(200, done)
})

test('should get multiple files on same field name', function (done) {
  var server = koa().use(betterBody())
  server.use(function * () {
    test.ok(this.request.files)
    test.strictEqual(this.request.files[0].name, 'package.json')
    test.strictEqual(this.request.files[1].name, 'utils.js')
    test.strictEqual(this.request.fields.pkg[0].name, 'package.json')
    test.strictEqual(this.request.fields.pkg[1].name, 'utils.js')
    this.body = 'ok2'
  })
  request(server.callback())
    .post('/')
    .type('multipart/form-data')
    .attach('pkg', filepath('package.json'))
    .attach('pkg', filepath('utils.js'))
    .expect(200)
    .expect('ok2', done)
})
test('should get multiple fields on same field name', function (done) {
  var server = koa().use(betterBody())
  server.use(function * () {
    test.ok(this.request.fields)
    test.deepEqual(this.request.fields.foo, ['bar', 'baz'])
    test.strictEqual(this.request.fields.baz, 'qux')
    this.body = 'ok3'
  })
  request(server.callback())
    .post('/')
    .type('multipart/form-data')
    .field('foo', 'bar')
    .field('foo', 'baz')
    .field('baz', 'qux')
    .expect(200)
    .expect('ok3', done)
})
test('should get 3 or more fields on same field name', function (done) {
  var server = koa().use(betterBody())
  server.use(function * () {
    test.ok(this.request.fields)
    test.deepEqual(this.request.fields.foo, ['bar', 'baz', 'bop'])
    this.body = 'ok'
  })
  request(server.callback())
    .post('/')
    .type('multipart/form-data')
    .field('foo', 'bar')
    .field('foo', 'baz')
    .field('foo', 'bop')
    .expect(200)
    .expect('ok', done)
})
test('should **conflicts** between fields and files', function (done) {
  var server = koa().use(betterBody())
  server.use(function * () {
    test.ok(this.request.files)
    test.ok(this.request.fields)
    test.strictEqual(this.request.files[0].name, 'package.json')
    test.strictEqual(this.request.files[1].name, 'utils.js')
    test.strictEqual(this.request.fields.pkg[0].name, 'package.json')
    test.strictEqual(this.request.fields.pkg[1].name, 'utils.js')
    test.deepEqual(this.request.fields.aaa, ['bbb', 'ddd'])
    this.body = 'ok4'
  })
  request(server.callback())
    .post('/')
    .type('multipart/form-data')
    // notice that there will be files on `pkg`, not `foo` string
    .field('pkg', 'foo')
    .attach('pkg', filepath('package.json'))
    .attach('pkg', filepath('utils.js'))
    .field('aaa', 'bbb')
    .field('aaa', 'ddd')
    .expect(200)
    .expect('ok4', done)
})
