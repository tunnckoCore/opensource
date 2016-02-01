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
  comments: [
    'z => {\n  /* var foo = 1\n  return z + z */return 2\n  }',
    '(x, y) => {\n  // y = y + 2\n  return y + x}',
    '(n) => {\n  // function (c) {return c}\n  // (a) => {return a}\n  return n + n}',
    'function fn (a) {\n  // return (a) => 2 end\nreturn a > 2}',
    'function named (b) {\n  // function (c) {return c}\n return b * 3}',
    'function no () {\n  // return false\n return true}'
  ],
  arrows: [
    'z => {\n  var foo = 1\n  return z * z}',
    '(j, k) => {\n  var foo = 1\n  return j + k}',
    '(a, b) => a * b',
    'x => x * 2 * x'
  ],
  regulars: [
    'function named (a, b, cb) {\n  var foo = 1\n  cb(null, a * b)\n  }',
    'function (x, y) {\n  var z = 2\n  return x + y + z)\n  }'
  ],
  specials: [
    'function named(a, b, cb) {\n  var foo = 1\n  cb(null, a * b)\n  }',
    'function named(a, b, cb){\n  var foo = 1\n  cb(null, a * b)\n  }',
    'function named (a, b, cb){\n  var foo = 1\n  cb(null, a * b)\n  }',

    'function(x, y) {\n  var z = 2\n  return x + y + z)\n  }',
    'function(x, y){\n  var z = 2\n  return x + y + z)\n  }',
    'function (x, y){\n  var z = 2\n  return x + y + z)\n  }'
  ],
  noParams: [
    'function () {\n  return 123\n  }',
    'function named () {\n  return 456\n  }'
  ]
}

var expected = {
  comments: [{
    name: 'anonymous',
    params: 'z',
    args: ['z'],
    body: '\n  /* var foo = 1\n  return z + z */return 2\n  ',
    value: 'z => {\n  /* var foo = 1\n  return z + z */return 2\n  }'
  }, {
    name: 'anonymous',
    params: 'x, y',
    args: ['x', 'y'],
    body: '\n  // y = y + 2\n  return y + x',
    value: '(x, y) => {\n  // y = y + 2\n  return y + x}'
  }, {
    name: 'anonymous',
    params: 'n',
    args: ['n'],
    body: '\n  // function (c) {return c}\n  // (a) => {return a}\n  return n + n',
    value: '(n) => {\n  // function (c) {return c}\n  // (a) => {return a}\n  return n + n}'
  }, {
    name: 'fn',
    params: 'a',
    args: ['a'],
    body: '\n  // return (a) => 2 end\nreturn a > 2',
    value: 'function fn (a) {\n  // return (a) => 2 end\nreturn a > 2}'
  }, {
    name: 'named',
    params: 'b',
    args: ['b'],
    body: '\n  // function (c) {return c}\n return b * 3',
    value: 'function named (b) {\n  // function (c) {return c}\n return b * 3}'
  }, {
    name: 'no',
    params: '',
    args: [],
    body: '\n  // return false\n return true',
    value: 'function no () {\n  // return false\n return true}'
  }],
  arrows: [{
    name: 'anonymous',
    params: 'z',
    args: ['z'],
    body: '\n  var foo = 1\n  return z * z',
    value: 'z => {\n  var foo = 1\n  return z * z}'
  }, {
    name: 'anonymous',
    params: 'j, k',
    args: ['j', 'k'],
    body: '\n  var foo = 1\n  return j + k',
    value: '(j, k) => {\n  var foo = 1\n  return j + k}'
  }, {
    name: 'anonymous',
    params: 'a, b',
    args: ['a', 'b'],
    body: 'a * b',
    value: '(a, b) => a * b'
  }, {
    name: 'anonymous',
    params: 'x',
    args: ['x'],
    body: 'x * 2 * x',
    value: 'x => x * 2 * x'
  }],
  regulars: [{
    name: 'named',
    params: 'a, b, cb',
    args: ['a', 'b', 'cb'],
    body: '\n  var foo = 1\n  cb(null, a * b)\n  ',
    value: 'function named (a, b, cb) {\n  var foo = 1\n  cb(null, a * b)\n  }'
  }, {
    name: 'anonymous',
    params: 'x, y',
    args: ['x', 'y'],
    body: '\n  var z = 2\n  return x + y + z)\n  ',
    value: 'function (x, y) {\n  var z = 2\n  return x + y + z)\n  }'
  }],
  noParams: [{
    name: 'anonymous',
    params: '',
    args: [],
    body: '\n  return 123\n  ',
    value: 'function () {\n  return 123\n  }'
  }, {
    name: 'named',
    params: '',
    args: [],
    body: '\n  return 456\n  ',
    value: 'function named () {\n  return 456\n  }'
  }]
}

forIn(actuals, function (values, key) {
  test(key, function () {
    values.forEach(function (val, i) {
      var actual = parseFunction(val)
      var expects = key === 'specials' ? expected['regulars'][i > 2 ? 1 : 0] : expected[key][i]

      test(actual.value.replace(/\n/g, '\\n'), function (done) {
        test.strictEqual(actual.valid, true)
        test.strictEqual(actual.invalid, false)
        test.strictEqual(actual.name, expects.name)
        test.strictEqual(actual.params, expects.params)
        test.strictEqual(actual.parameters, expects.params)
        test.deepEqual(actual.args, expects.args)
        test.deepEqual(actual.arguments, expects.args)
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
