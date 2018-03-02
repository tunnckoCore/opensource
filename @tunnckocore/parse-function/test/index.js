/**
 * @author Charlike Mike Reagent <open.source.charlike@gmail.com>
 * @copyright 2016-present @tunnckoCore/team and contributors
 * @license MIT
 */

/* eslint-disable max-len */

import test from 'mukla'

import espree from 'espree'
import babylon from 'babylon'
import acornLoose from 'acorn/dist/acorn_loose'

import acorn from 'acorn'
import forIn from 'for-in'
import clone from 'clone-deep'
import parseFunction from '../src/index'

const acornParse = acorn.parse
const espreeParse = espree.parse
const babylonParse = babylon.parse
const acornLooseParse = acornLoose.parse_dammit

const actuals = {
  regulars: [
    'function (a = {foo: "ba)r", baz: 123}, cb, ...restArgs) {return a * 3}',
    'function (b, callback, ...restArgs) {callback(null, b + 3)}',
    'function (c) {return c * 3}',
    'function (...restArgs) {return 321}',
    'function () {}',
    'function (a = (true, false)) {}',
    'function (a = (true, null)) {}',
    'function (a = (true, "bar")) {}',
    'function (a, b = (i++, true)) {}',
    'function (a = 1) {}',
  ],
  named: [
    'function namedFn (a = {foo: "ba)r", baz: 123}, cb, ...restArgs) {return a * 3}',
    'function namedFn (b, callback, ...restArgs) {callback(null, b + 3)}',
    'function namedFn (c) {return c * 3}',
    'function namedFn (...restArgs) {return 321}',
    'function namedFn () {}',
    'function namedFn(a = (true, false)) {}',
    'function namedFn(a = (true, null)) {}',
    'function namedFn(a = (true, "bar")) {}',
    'function namedFn(a, b = (i++, true)) {}',
    'function namedFn(a = 1) {}',
  ],
  generators: [
    'function * namedFn (a = {foo: "ba)r", baz: 123}, cb, ...restArgs) {return a * 3}',
    'function * namedFn (b, callback, ...restArgs) {callback(null, b + 3)}',
    'function * namedFn (c) {return c * 3}',
    'function * namedFn (...restArgs) {return 321}',
    'function * namedFn () {}',
    'function * namedFn(a = (true, false)) {}',
    'function * namedFn(a = (true, null)) {}',
    'function * namedFn(a = (true, "bar")) {}',
    'function * namedFn(a, b = (i++, true)) {}',
    'function * namedFn(a = 1) {}',
  ],
  arrows: [
    '(a = {foo: "ba)r", baz: 123}, cb, ...restArgs) => {return a * 3}',
    '(b, callback, ...restArgs) => {callback(null, b + 3)}',
    '(c) => {return c * 3}',
    '(...restArgs) => {return 321}',
    '() => {}',
    '(a = (true, false)) => {}',
    '(a = (true, null)) => {}',
    '(a = (true, "bar")) => {}',
    '(a, b = (i++, true)) => {}',
    '(a = 1) => {}',
    '(a) => a * 3 * a',
    'd => d * 355 * d',
    'e => {return e + 5235 / e}',
    '(a, b) => a + 3 + b',
    '(x, y, ...restArgs) => console.log({ value: x * y })',
  ],
}

/**
 * Merge all into one
 * and prepend `async` keyword
 * before each function
 */

actuals.asyncs = actuals.regulars
  .concat(actuals.named)
  .concat(actuals.arrows)
  .map((item) => `async ${item}`)

const regulars = [
  {
    name: null,
    params: 'a, cb, restArgs',
    args: ['a', 'cb', 'restArgs'],
    body: 'return a * 3',
    defaults: {
      a: '{foo: "ba)r", baz: 123}',
      cb: undefined,
      restArgs: undefined,
    },
  },
  {
    name: null,
    params: 'b, callback, restArgs',
    args: ['b', 'callback', 'restArgs'],
    body: 'callback(null, b + 3)',
    defaults: { b: undefined, callback: undefined, restArgs: undefined },
  },
  {
    name: null,
    params: 'c',
    args: ['c'],
    body: 'return c * 3',
    defaults: { c: undefined },
  },
  {
    name: null,
    params: 'restArgs',
    args: ['restArgs'],
    body: 'return 321',
    defaults: { restArgs: undefined },
  },
  {
    name: null,
    params: '',
    args: [],
    body: '',
    defaults: {},
  },
  {
    name: null,
    params: 'a',
    args: ['a'],
    body: '',
    defaults: { a: 'false' },
  },
  {
    name: null,
    params: 'a',
    args: ['a'],
    body: '',
    defaults: { a: 'null' },
  },
  {
    name: null,
    params: 'a',
    args: ['a'],
    body: '',
    defaults: { a: '"bar"' },
  },
  {
    name: null,
    params: 'a, b',
    args: ['a', 'b'],
    body: '',
    defaults: { a: undefined, b: 'true' },
  },
  {
    name: null,
    params: 'a',
    args: ['a'],
    body: '',
    defaults: { a: '1' },
  },
]

/**
 * All of the regular functions
 * variants plus few more
 */

const arrows = clone(regulars).concat([
  {
    name: null,
    params: 'a',
    args: ['a'],
    body: 'a * 3 * a',
    defaults: { a: undefined },
  },
  {
    name: null,
    params: 'd',
    args: ['d'],
    body: 'd * 355 * d',
    defaults: { d: undefined },
  },
  {
    name: null,
    params: 'e',
    args: ['e'],
    body: 'return e + 5235 / e',
    defaults: { e: undefined },
  },
  {
    name: null,
    params: 'a, b',
    args: ['a', 'b'],
    body: 'a + 3 + b',
    defaults: { a: undefined, b: undefined },
  },
  {
    name: null,
    params: 'x, y, restArgs',
    args: ['x', 'y', 'restArgs'],
    body: 'console.log({ value: x * y })',
    defaults: { x: undefined, y: undefined, restArgs: undefined },
  },
])

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
  asyncs: regulars.concat(named).concat(arrows),
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
      const value = actual.value.replace(/^\(\{? ?/, '').replace(/\)$/, '')

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

  // bug in v4 and v5
  // https://github.com/tunnckoCore/parse-function/issues/3
  // test(`#${testsCount++} - ${parserName} - should not fails to get .body when something after close curly`, (done) => {
  //   const actual = parseFn('function (a) {return a * 2}; var b = 1')
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
    const actual = parseFn(function fooBar (a, bc) {
      return a + bc
    })
    test.strictEqual(actual.name, 'fooBar')
    test.strictEqual(actual.params, 'a, bc')
    test.strictEqual(actual.body, '\n      return a + bc;\n    ')
    done()
  })

  test(`#${testsCount++} - ${parserName} - should work for object methods`, (done) => {
    const obj = {
      foo (a, b, c) {
        return 123
      },
      bar (a) {
        return () => a
      },
      * gen (a) {},
    }

    const actual = parseFn(obj.foo)
    test.strictEqual(actual.name, 'foo')
    test.strictEqual(actual.params, 'a, b, c')
    test.strictEqual(actual.body, '\n        return 123;\n      ')

    const bar = parseFn(obj.bar)
    test.strictEqual(bar.name, 'bar')
    test.strictEqual(bar.body, '\n        return () => a;\n      ')

    const gen = parseFn(obj.gen)
    test.strictEqual(gen.name, 'gen')

    const namedFn = `namedFn (a = {foo: 'ba)r', baz: 123}, cb, ...restArgs) { return a * 3 }`
    const named = parseFn(namedFn)
    test.strictEqual(named.name, 'namedFn')
    test.strictEqual(named.args.length, 3)
    test.strictEqual(named.body, ' return a * 3 ')
    done()
  })

  test(`#${testsCount++} - ${parserName} - plugins api`, (done) => {
    const fnStr = `() => 123 + a + 44`
    const plugin = (app) => (node, result) => {
      result.called = true
      // you may want to return the `result`,
      // but it is the same as not return it
      // return result
    }
    const result = parseFn(fnStr, {}, plugin)

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

factory('babylon default', (code, opts, plugin) => {
  const app = parseFunction()
  if (plugin) app.use(plugin)
  return app.parse(code, opts)
})

factory('babylon.parse', (code, opts, plugin) => {
  const app = parseFunction({
    parse: babylonParse,
    ecmaVersion: 2017,
  })
  if (plugin) app.use(plugin)
  return app.parse(code, opts)
})

factory('acorn.parse', (code, opts, plugin) => {
  const app = parseFunction({
    parse: acornParse,
    ecmaVersion: 2017,
  })
  if (plugin) app.use(plugin)
  return app.parse(code, opts)
})

factory('acorn.parse_dammit', (code, opts, plugin) => {
  const app = parseFunction()
  if (plugin) app.use(plugin)
  return app.parse(
    code,
    Object.assign(
      {
        parse: acornLooseParse,
        ecmaVersion: 2017,
      },
      opts
    )
  )
})

factory('espree.parse', (code, opts, plugin) => {
  const app = parseFunction({
    parse: espreeParse,
    ecmaVersion: 8,
  })
  if (plugin) app.use(plugin)
  return app.parse(code, opts)
})

test('should just extend the core API, not the end result', (done) => {
  const app = parseFunction()
  app.use((inst) => {
    app.define(inst, 'hello', (place) => `Hello ${place}!!`)
  })
  const ret = app.hello('pinky World')
  test.strictEqual(ret, 'Hello pinky World!!')
  done()
})

test('should call fn returned from plugin only when `parse` is called', (done) => {
  const app = parseFunction({
    ecmaVersion: 2017,
  })
  let called = 0
  app.use((app) => {
    called = 1
    return (node, result) => {
      called = 2
    }
  })

  test.strictEqual(called, 1)

  let res = app.parse('(a, b) => {}')
  test.strictEqual(called, 2)
  test.strictEqual(res.params, 'a, b')
  done()
})

// https://github.com/tunnckoCore/parse-function/issues/61
test('should work with an async arrow function with an `if` statement', (done) => {
  const app = parseFunction()
  const parsed = app.parse('async (v) => { if (v) {} }')
  test.deepEqual(parsed, {
    name: null,
    body: ' if (v) {} ',
    args: ['v'],
    params: 'v',
  })
  done()
})
