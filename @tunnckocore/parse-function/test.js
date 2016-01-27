/*!
 * parse-function <https://github.com/tunnckoCore/parse-function>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('assertit')
var parseFunction = require('./index')

var values = [
  // STRINGS
  'z => {\n  var foo = 1\n  return z * z}',
  '(j, k) => {\n  var foo = 1\n  return j + k}',
  '(a, b) => a * b',
  'x => x * 2 * x',
  'function named(a, b, cb) {\n  var foo = 1\n  cb(null, a * b)}',
  'function spaced (y, cb) {\n  var bar = 2\n  cb(null, y * 3)}',
  'function (a) {\n  var qux = 123\n  return a * qux}'
]

// FUNCTIONS - works the same
// var fns = [
//   z => {
//     var foo = 1
//     return z * z
//   },
//   (j, k) => {
//     var foo = 1
//     return j + k
//   },
//   (a, b) => a * b,
//   x => x * 2 * x,
//   function named(a, b, cb) {
//     var foo = 1
//     cb(null, a * b)
//   },
//   function spaced (y, cb) {
//     var bar = 2
//     cb(null, y * 3)
//   },
//   function (a) {
//     var foo = 1
//     return a
//   }
// ]

var expected = [
  {
    name: 'anonymous',
    params: 'z',
    args: ['z'],
    body: '\n  var foo = 1\n  return z * z',
    value: 'z => {\n  var foo = 1\n  return z * z}'
  },
  {
    name: 'anonymous',
    params: 'j, k',
    args: ['j', 'k'],
    body: '\n  var foo = 1\n  return j + k',
    value: '(j, k) => {\n  var foo = 1\n  return j + k}'
  },
  {
    name: 'anonymous',
    params: 'a, b',
    args: ['a', 'b'],
    body: 'a * b',
    value: '(a, b) => a * b'
  },
  {
    name: 'anonymous',
    params: 'x',
    args: ['x'],
    body: 'x * 2 * x',
    value: 'x => x * 2 * x'
  },
  {
    name: 'named',
    params: 'a, b, cb',
    args: ['a', 'b', 'cb'],
    body: '\n  var foo = 1\n  cb(null, a * b)',
    value: 'function named(a, b, cb) {\n  var foo = 1\n  cb(null, a * b)}'
  },
  {
    name: 'spaced',
    params: 'y, cb',
    args: ['y', 'cb'],
    body: '\n  var bar = 2\n  cb(null, y * 3)',
    value: 'function spaced (y, cb) {\n  var bar = 2\n  cb(null, y * 3)}'
  },
  {
    name: 'anonymous',
    params: 'a',
    args: ['a'],
    body: '\n  var qux = 123\n  return a * qux',
    value: 'function (a) {\n  var qux = 123\n  return a * qux}'
  }
]

values.forEach(function (val, i) {
  var data = parseFunction(val)
  test(data.value.replace(/\n/g, '\\n'), function (done) {
    test.strictEqual(data.name, expected[i].name)
    test.strictEqual(data.params, expected[i].params)
    test.strictEqual(data.parameters, expected[i].params)
    test.deepEqual(data.args, expected[i].args)
    test.deepEqual(data.arguments, expected[i].args)
    test.strictEqual(data.body, expected[i].body)
    test.strictEqual(data.value, expected[i].value)
    test.ok(data.orig)
    done()
  })
})
