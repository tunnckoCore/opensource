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
var coverageCodeRegex = require('coverage-code-regex')
var cleanupCoverageCode = require('cleanup-coverage-code')

function hackExpected (expected) {
  expected = expected.split('var').filter(Boolean)
  expected = expected.map(function (val) {
    return val.replace(/\s+/g, '')
  }).map(function (val) {
    return val.replace(/(function|return)(?:t|f)*?(?!\{)/g, '$1 ')
  })
  expected = expected.filter(Boolean).join('var ')
  expected = 'var ' + expected

  return expected
}

test('should parse given string to object', function (done) {
  var fixture = 'function testing(val, re, beta) { return true }'
  var actual = parseFunction(fixture)
  var expected = {
    name: 'testing',
    params: 'val, re, beta',
    parameters: 'val, re, beta',
    args: ['val', 're', 'beta'],
    arguments: ['val', 're', 'beta'],
    body: ' return true '
  }

  test.deepEqual(actual, expected)
  done()
})

test('should parse given function to object', function (done) {
  /* istanbul ignore next */
  var fixture = function yeah (cmd, params, cb) {
    var fn = function beta () {}
    var obj = {
      one: 'two',
      fix: fn
    }
    return obj
  }
  var actual = parseFunction(fixture)
  var expected = {
    name: 'yeah',
    params: 'cmd, params, cb',
    parameters: 'cmd, params, cb',
    args: ['cmd', 'params', 'cb'],
    arguments: ['cmd', 'params', 'cb'],
    body: "\n    var fn = function beta () {}\n    var obj = {\n      one: 'two',\n      fix: fn\n    }\n    return obj\n  "
  }

  // hack for coverage only
  if (coverageCodeRegex().test(actual.body)) {
    actual.parameters = actual.parameters.replace(/\s*/g, '')
    expected.parameters = expected.parameters.replace(/\s*/g, '')
    actual.body = cleanupCoverageCode(actual.body).replace(/;/g, '')
    expected.body = hackExpected(expected.body)
  }

  test.deepEqual(actual.args, expected.args)
  test.strictEqual(actual.name, expected.name)
  test.strictEqual(actual.parameters, expected.parameters)
  test.deepEqual(actual.arguments, expected.arguments)
  test.strictEqual(actual.body, expected.body)
  done()
})

test('should parse given anonymous function', function (done) {
  /* istanbul ignore next */
  var fixture = function (a, b, c) {
    var f = function beta () {}
    var o = {
      one: f,
      fix: 'delta'
    }
    return o
  }
  var actual = parseFunction(fixture)
  var expected = {
    name: 'anonymous',
    params: 'a, b, c',
    parameters: 'a, b, c',
    args: ['a', 'b', 'c'],
    arguments: ['a', 'b', 'c'],
    body: "\n    var f = function beta () {}\n    var o = {\n      one: f,\n      fix: 'delta'\n    }\n    return o\n  "
  }

  // hack for coverage only
  if (coverageCodeRegex().test(actual.body)) {
    actual.parameters = actual.parameters.replace(/\s*/g, '')
    expected.parameters = expected.parameters.replace(/\s*/g, '')
    actual.body = cleanupCoverageCode(actual.body).replace(/;/g, '')
    expected.body = hackExpected(expected.body)
  }

  test.deepEqual(actual.args, expected.args)
  test.strictEqual(actual.name, expected.name)
  test.strictEqual(actual.parameters, expected.parameters)
  test.deepEqual(actual.arguments, expected.arguments)
  test.strictEqual(cleanupCoverageCode(actual.body), expected.body)
  done()
})

test('should have `.args` empty array and `.params` empty string', function (done) {
  /* istanbul ignore next */
  var fixture = function named () {
    return true
  }
  var actual = parseFunction(fixture)
  var expected = {
    name: 'named',
    params: '',
    parameters: '',
    args: [],
    arguments: [],
    body: '\n    return true\n  '
  }

  // hack for coverage only
  if (coverageCodeRegex().test(actual.body)) {
    actual.parameters = actual.parameters.replace(/\s*/g, '')
    expected.parameters = expected.parameters.replace(/\s*/g, '')
    actual.body = cleanupCoverageCode(actual.body).replace(/;/g, '')
    expected.body = hackExpected(expected.body).replace('var ', '')
  }

  test.deepEqual(actual.args, expected.args)
  test.strictEqual(actual.name, expected.name)
  test.strictEqual(actual.parameters, expected.parameters)
  test.deepEqual(actual.arguments, expected.arguments)
  test.strictEqual(cleanupCoverageCode(actual.body), expected.body)
  done()
})

test('should have default empty properties, except `.name` which is "anonymous"', function (done) {
  var fixture = function () {}
  var actual = parseFunction(fixture)
  var expected = {
    name: 'anonymous',
    params: '',
    parameters: '',
    args: [],
    arguments: [],
    body: ''
  }

  // hack for coverage only
  if (coverageCodeRegex().test(actual.body)) {
    actual.body = cleanupCoverageCode(actual.body).replace(/;/g, '')
  }

  test.deepEqual(actual.args, expected.args)
  test.strictEqual(actual.name, expected.name)
  test.strictEqual(actual.parameters, expected.parameters)
  test.deepEqual(actual.arguments, expected.arguments)
  test.strictEqual(actual.body, expected.body)
  done()
})

