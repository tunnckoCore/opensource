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
var forIn = require('for-in')

var actuals = {
  regulars: [
    'function (a = {foo: "ba)r", baz: 123}, cb) {return a * 3}',
    'function (b, callback) {callback(null, b + 3)}',
    'function (c) {return c * 3}',
    'function () {return 321}',
    'function () {}'
  ],
  named: [
    'function named (a = {foo: "ba)r", baz: 123}, cb) {return a * 3}',
    'function named (b, callback) {callback(null, b + 3)}',
    'function named (c) {return c * 3}',
    'function named () {return 321}',
    'function named () {}'
  ],
  arrows: [
    '(foo = {done: (x) => console.log({ value: x })}, bar) => {return foo.done}',
    '(z, cb) => {cb(null, z + 3)}',
    '(c) => {return c * 3}',
    '() => {return 456}',
    '() => {}',
    '(a) => a * 3 * a',
    'd => d * 3 * d',
    'e => {return e * 3 * e}',
    '(a, b) => a + 3 + b',
    '(x, y) => console.log({ value: x * y })'
  ]
}

var expected = {
  regulars: [{
    name: 'anonymous',
    params: 'a, cb',
    args: ['a', 'cb'],
    body: 'return a * 3',
    defaults: {a: '{foo: "ba)r", baz: 123}', cb: undefined},
    value: 'function (a = {foo: "ba)r", baz: 123}, cb) {return a * 3}'
  }, {
    name: 'anonymous',
    params: 'b, callback',
    args: ['b', 'callback'],
    body: 'callback(null, b + 3)',
    defaults: {b: undefined, callback: undefined},
    value: 'function (b, callback) {callback(null, b + 3)}'
  }, {
    name: 'anonymous',
    params: 'c',
    args: ['c'],
    body: 'return c * 3',
    defaults: {c: undefined},
    value: 'function (c) {return c * 3}'
  }, {
    name: 'anonymous',
    params: '',
    args: [],
    body: 'return 321',
    defaults: {},
    value: 'function () {return 321}'
  }, {
    name: 'anonymous',
    params: '',
    args: [],
    body: '',
    defaults: {},
    value: 'function () {}'
  }],
  arrows: [{
    name: 'anonymous',
    params: 'foo, bar',
    args: ['foo', 'bar'],
    body: 'return foo.done',
    defaults: {foo: '{done: (x) => console.log({ value: x })}', bar: undefined},
    value: '(foo = {done: (x) => console.log({ value: x })}, bar) => {return foo.done}'
  }, {
    name: 'anonymous',
    params: 'z, cb',
    args: ['z', 'cb'],
    body: 'cb(null, z + 3)',
    defaults: {z: undefined, cb: undefined},
    value: '(z, cb) => {cb(null, z + 3)}'
  }, {
    name: 'anonymous',
    params: 'c',
    args: ['c'],
    body: 'return c * 3',
    defaults: {c: undefined},
    value: '(c) => {return c * 3}'
  }, {
    name: 'anonymous',
    params: '',
    args: [],
    body: 'return 456',
    defaults: {},
    value: '() => {return 456}'
  }, {
    name: 'anonymous',
    params: '',
    args: [],
    body: '',
    defaults: {},
    value: '() => {}'
  }, {
    name: 'anonymous',
    params: 'a',
    args: ['a'],
    body: 'a * 3 * a',
    defaults: {a: undefined},
    value: '(a) => a * 3 * a'
  }, {
    name: 'anonymous',
    params: 'd',
    args: ['d'],
    body: 'd * 3 * d',
    defaults: {d: undefined},
    value: 'd => d * 3 * d'
  }, {
    name: 'anonymous',
    params: 'e',
    args: ['e'],
    body: 'return e * 3 * e',
    defaults: {e: undefined},
    value: 'e => {return e * 3 * e}'
  }, {
    name: 'anonymous',
    params: 'a, b',
    args: ['a', 'b'],
    body: 'a + 3 + b',
    defaults: {a: undefined, b: undefined},
    value: '(a, b) => a + 3 + b'
  }, {
    name: 'anonymous',
    params: 'x, y',
    args: ['x', 'y'],
    body: 'console.log({ value: x * y })',
    defaults: {x: undefined, y: undefined},
    value: '(x, y) => console.log({ value: x * y })'
  }]
}

forIn(actuals, function (values, key) {
  test(key, function () {
    values.forEach(function (val, i) {
      var actual = parseFunction(val)
      var expects = expected[key === 'named' ? 'regulars' : key][i]
      if (key === 'named') {
        expects.name = 'named'
      }

      test(actual.value.replace(/\n/g, '\\n'), function (done) {
        test.strictEqual(actual.valid, true)
        test.strictEqual(actual.invalid, false)
        test.strictEqual(actual.name, expects.name)
        test.strictEqual(actual.params, expects.params)
        test.strictEqual(actual.parameters, expects.params)
        test.deepEqual(actual.args, expects.args)
        test.deepEqual(actual.arguments, expects.args)
        test.deepEqual(actual.defaults, expects.defaults)
        test.strictEqual(actual.body, expects.body)
        test.ok(actual.orig)
        test.ok(actual.value)
        test.ok(actual.value.length)
        done()
      })
    })
  })
})

test('should return object with default values when invalid (not a function/string)', function (done) {
  var actual = parseFunction(123456)

  test.strictEqual(actual.valid, false)
  test.strictEqual(actual.invalid, true)
  test.strictEqual(actual.orig, 123456)
  test.strictEqual(actual.value, '')
  test.strictEqual(actual.value.length, 0)
  test.strictEqual(actual.name, 'anonymous')
  test.strictEqual(actual.body, '')
  test.strictEqual(actual.params, '')
  test.strictEqual(actual.parameters, '')
  test.deepEqual(actual.args, [])
  test.deepEqual(actual.arguments, [])
  done()
})

test('should have `.valid/.invalid` hidden properties', function (done) {
  var actual = parseFunction([1, 2, 3])

  test.strictEqual(actual.valid, false)
  test.strictEqual(actual.invalid, true)
  test.strictEqual(actual.value, '')
  test.strictEqual(actual.value.length, 0)
  done()
})

test('should not fails to get .body when something after close curly (issue#3)', function (done) {
  var actual = parseFunction('function (a) {return a * 2} sa')
  test.strictEqual(actual.body, 'return a * 2')
  done()
})
