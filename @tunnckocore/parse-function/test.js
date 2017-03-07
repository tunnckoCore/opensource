/*!
 * parse-function <https://github.com/tunnckoCore/parse-function>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

const test = require('mukla')
const acorn = require('acorn')
const forIn = require('for-in')
const clone = require('clone-deep')
const parseFunction = require('./index')

const actuals = {
  regulars: [
    'function (a = {foo: "ba)r", baz: 123}, cb, ...restArgs) {return a * 3}',
    'function (b, callback, ...restArgs) {callback(null, b + 3)}',
    'function (c) {return c * 3}',
    'function (...restArgs) {return 321}',
    'function () {}'
  ],
  named: [
    'function namedFn (a = {foo: "ba)r", baz: 123}, cb, ...restArgs) {return a * 3}',
    'function namedFn (b, callback, ...restArgs) {callback(null, b + 3)}',
    'function namedFn (c) {return c * 3}',
    'function namedFn (...restArgs) {return 321}',
    'function namedFn () {}'
  ],
  generators: [
    'function * namedFn (a = {foo: "ba)r", baz: 123}, cb, ...restArgs) {return a * 3}',
    'function * namedFn (b, callback, ...restArgs) {callback(null, b + 3)}',
    'function * namedFn (c) {return c * 3}',
    'function * namedFn (...restArgs) {return 321}',
    'function * namedFn () {}'
  ],
  arrows: [
    '(a = {foo: "ba)r", baz: 123}, cb, ...restArgs) => {return a * 3}',
    '(b, callback, ...restArgs) => {callback(null, b + 3)}',
    '(c) => {return c * 3}',
    '(...restArgs) => {return 321}',
    '() => {}',
    '(a) => a * 3 * a',
    'd => d * 355 * d',
    'e => {return e + 5235 / e}',
    '(a, b) => a + 3 + b',
    '(x, y, ...restArgs) => console.log({ value: x * y })'
  ]
}

/**
 * Merge all into one
 * and prepend `async` keyword
 * before each function
 */

actuals.asyncs = actuals.regulars
  .concat(actuals.named)
  .concat(actuals.arrows)
  .map((item) => {
    return `async ${item}`
  })

const regulars = [{
  name: null,
  params: 'a, cb, restArgs',
  args: ['a', 'cb', 'restArgs'],
  body: 'return a * 3',
  defaults: { a: '{foo: "ba)r", baz: 123}', cb: undefined, restArgs: undefined }
}, {
  name: null,
  params: 'b, callback, restArgs',
  args: ['b', 'callback', 'restArgs'],
  body: 'callback(null, b + 3)',
  defaults: { b: undefined, callback: undefined, restArgs: undefined }
}, {
  name: null,
  params: 'c',
  args: ['c'],
  body: 'return c * 3',
  defaults: { c: undefined }
}, {
  name: null,
  params: 'restArgs',
  args: ['restArgs'],
  body: 'return 321',
  defaults: { restArgs: undefined }
}, {
  name: null,
  params: '',
  args: [],
  body: '',
  defaults: {}
}]

/**
 * All of the regular functions
 * variants plus few more
 */

const arrows = clone(regulars).concat([{
  name: null,
  params: 'a',
  args: ['a'],
  body: 'a * 3 * a',
  defaults: { a: undefined }
}, {
  name: null,
  params: 'd',
  args: ['d'],
  body: 'd * 355 * d',
  defaults: { d: undefined }
}, {
  name: null,
  params: 'e',
  args: ['e'],
  body: 'return e + 5235 / e',
  defaults: { e: undefined }
}, {
  name: null,
  params: 'a, b',
  args: ['a', 'b'],
  body: 'a + 3 + b',
  defaults: { a: undefined, b: undefined }
}, {
  name: null,
  params: 'x, y, restArgs',
  args: ['x', 'y', 'restArgs'],
  body: 'console.log({ value: x * y })',
  defaults: { x: undefined, y: undefined, restArgs: undefined }
}])

/**
 * All of the regulars, but
 * with different name
 */

const named = clone(regulars).map((item) => {
  item.name = 'namedFn'
  return item
})

const expected = {
  regulars: regulars,
  named: named,
  generators: named,
  arrows: arrows,
  asyncs: regulars.concat(named).concat(arrows)
}

let testsCount = 1

/**
 * Factory for DRY, we run all tests
 * over two available parsers - one
 * is the default `babylon`, second is
 * the `acorn.parse` method.
 */

function factory (parserName, parseFn) {
  forIn(actuals, (values, key) => {
    values.forEach((code, i) => {
      const actual = parseFn(code)
      const expect = expected[key][i]
      const value = actual.value
        .replace(/^\( \{? ?/, '')
        .replace(/ \)$/, '')

      test(`#${testsCount++} - ${parserName} - ${value}`, (done) => {
        test.strictEqual(actual.isValid, true)
        test.strictEqual(actual.name, expect.name)
        test.strictEqual(actual.body, expect.body)
        test.strictEqual(actual.params, expect.params)
        test.deepEqual(actual.args, expect.args)
        test.deepEqual(actual.defaults, expect.defaults)
        test.ok(actual.value)
        done()
      })
    })
  })

  test(`#${testsCount++} - ${parserName} - should return object with default values when invalid`, (done) => {
    const actual = parseFn(123456)

    test.strictEqual(actual.isValid, false)
    test.strictEqual(actual.value, '')
    test.strictEqual(actual.name, null)
    test.strictEqual(actual.body, '')
    test.strictEqual(actual.params, '')
    test.deepEqual(actual.args, [])
    done()
  })

  test(`#${testsCount++} - ${parserName} - should have '.isValid' and few '.is*'' hidden properties`, (done) => {
    const actual = parseFn([1, 2, 3])

    test.strictEqual(actual.isValid, false)
    test.strictEqual(actual.isArrow, false)
    test.strictEqual(actual.isAsync, false)
    test.strictEqual(actual.isNamed, false)
    test.strictEqual(actual.isAnonymous, false)
    test.strictEqual(actual.isGenerator, false)
    test.strictEqual(actual.isExpression, false)
    done()
  })

  // bug in v4, would throw
  // test(`#${testsCount++} - ${parserName} - should not fails to get .body when something after close curly (issue#3)`, (done) => {
  //   const actual = parseFn('function (a) {return a}; var b = 1')
  //   test.strictEqual(actual.body, 'return a * 2')
  //   done()
  // })

  test(`#${testsCount++} - ${parserName} - should work when comment in arguments (see #11)`, (done) => {
    const actual = parseFn('function (/* done */) { return 123 }')
    test.strictEqual(actual.params, '')
    test.strictEqual(actual.body, ' return 123 ')

    const res = parseFn('function (foo/* done */, bar) { return 123 }')
    test.strictEqual(res.params, 'foo, bar')
    test.strictEqual(res.body, ' return 123 ')
    done()
  })

  test(`#${testsCount++} - ${parserName} - should support to parse generator functions`, (done) => {
    const actual = parseFn('function * named (abc) { return abc + 123 }')
    test.strictEqual(actual.name, 'named')
    test.strictEqual(actual.params, 'abc')
    test.strictEqual(actual.body, ' return abc + 123 ')
    done()
  })

  test(`#${testsCount++} - ${parserName} - should support to parse async functions (ES2016)`, (done) => {
    const actual = parseFn('async function foo (bar) { return bar }')
    test.strictEqual(actual.name, 'foo')
    test.strictEqual(actual.params, 'bar')
    test.strictEqual(actual.body, ' return bar ')
    done()
  })

  test(`#${testsCount++} - ${parserName} - should parse a real function which is passed`, (done) => {
    const actual = parseFn(function fooBar (a, bc) { return a + bc })
    test.strictEqual(actual.name, 'fooBar')
    test.strictEqual(actual.params, 'a, bc')
    test.strictEqual(actual.body, ' return a + bc ')
    done()
  })

  test(`#${testsCount++} - ${parserName} - should work for object methods`, (done) => {
    const obj = {
      foo (a, b, c) { return 123 }
    }
    const actual = parseFn(obj.foo)
    test.strictEqual(actual.name, 'foo')
    test.strictEqual(actual.params, 'a, b, c')
    test.strictEqual(actual.body, ' return 123 ')
    done()
  })

  test(`#${testsCount++} - ${parserName} - plugins api`, (done) => {
    const fnStr = `() => 123 + a + 44`
    const result = parseFn(fnStr, {
      use: (node, result) => {
        result.called = true
      }
    })

    test.strictEqual(result.called, true)
    done()
  })

  test(`#${testsCount++} - ${parserName} - fn named "anonymous" has .name: 'anonymous'`, (done) => {
    const result = parseFn('function anonymous () {}')
    test.strictEqual(result.name, 'anonymous')
    test.strictEqual(result.isAnonymous, false)
    done()
  })

  test(`#${testsCount++} - ${parserName} - real anonymous fn has .name: null`, (done) => {
    const actual = parseFn('function () {}')
    test.strictEqual(actual.name, null)
    test.strictEqual(actual.isAnonymous, true)
    done()
  })
}

/**
 * Actually run all the tests
 */

factory('babylon default', function (code, opts) {
  return parseFunction(code, opts)
})

factory('babylon.parse', function (code, opts) {
  return parseFunction(code, Object.assign({
    parse: require('babylon').parse,
    ecmaVersion: 2017
  }, opts))
})

factory('acorn.parse', function (code, opts) {
  return parseFunction(code, Object.assign({
    parse: acorn.parse,
    ecmaVersion: 2017
  }, opts))
})

factory('acorn.parse_dammit', function (code, opts) {
  return parseFunction(code, Object.assign({
    parse: require('acorn/dist/acorn_loose').parse_dammit,
    ecmaVersion: 2017
  }, opts))
})

factory('espree.parse', function (code, opts) {
  return parseFunction(code, Object.assign({
    parse: require('espree').parse,
    ecmaVersion: 8
  }, opts))
})

