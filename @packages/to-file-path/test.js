/*!
 * to-file-path <https://github.com/tunnckoCore/to-file-path>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('assertit')
var toPath = require('./index')

test('should always return string', function (done) {
  test.strictEqual(typeof toPath(true), 'string')
  test.strictEqual(typeof toPath(null), 'string')
  test.strictEqual(typeof toPath(123), 'string')
  test.strictEqual(typeof toPath(true, true), 'string')
  test.strictEqual(typeof toPath(null, true), 'string')
  test.strictEqual(typeof toPath('a', 'b', 'c'), 'string')
  test.strictEqual(typeof toPath(1, 2, 3), 'string')
  test.strictEqual(typeof toPath(1, 'b', 3), 'string')
  test.strictEqual(typeof toPath({a: 'b'}, 'c'), 'string')
  test.strictEqual(typeof toPath(function a (b) {}, 'c'), 'string')
  done()
})

test('should JSON.stringify object values', function (done) {
  test.strictEqual(toPath('a', {b: 'c'}, 'd'), 'a/{"b":"c"}/d')
  test.strictEqual(toPath('a', {b: {foo: 'bar'}}, 'd'), 'a/{"b":{"foo":"bar"}}/d')
  done()
})

test('should create filepath from string with dot notation', function (done) {
  test.strictEqual(toPath('foo.bar.baz'), 'foo/bar/baz')
  test.strictEqual(toPath('foo.bar/baz.qux'), 'foo/bar/baz/qux')
  test.strictEqual(toPath('123.12.111.224'), '123/12/111/224')
  done()
})

test('should create filepath from list of arguments', function (done) {
  test.strictEqual(toPath('12.35', '224', '150', '78'), '12/35/224/150/78')
  test.strictEqual(toPath('12.35', '224.150'), '12/35/224/150')
  test.strictEqual(toPath('12', 78, 242, '356'), '12/78/242/356')
  test.strictEqual(toPath(123.22), '123/22')
  test.strictEqual(toPath(122), '122')
  test.strictEqual(toPath(122, 255), '122/255')
  done()
})

test('should create filepath from mixed type of arguments', function (done) {
  var actual = toPath(123, 'foo.bar', ['baz', 11, 'qux', 'aaa.bbb', 555], true, 'ddd')
  test.strictEqual(actual, '123/foo/bar/baz/11/qux/aaa/bbb/555/true/ddd')
  done()
})

test('should create filepath from Arguments object', function (done) {
  function fixture () {
    return toPath(arguments)
  }
  var actual = fixture(1, 2, 3, 'foo', 'bar.baz', ['qux', 4, 'aaa.bb', 5], 6)
  test.strictEqual(actual, '1/2/3/foo/bar/baz/qux/4/aaa/bb/5/6')
  done()
})
