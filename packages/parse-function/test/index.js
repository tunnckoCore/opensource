/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable no-plusplus */

// import test from 'mukla';

import espree from 'espree';
import { parse as babylonParse } from '@babel/parser';

import { parse as acornParse } from 'acorn';
import { parse as acornLooseParse } from 'acorn-loose';
import forIn from 'for-in';
import parseFunction from '../src';

const espreeParse = espree.parse;

const fixtures = {
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
};

/**
 * Merge all into one
 * and prepend `async` keyword
 * before each function
 */

fixtures.asyncs = fixtures.regulars
  .concat(fixtures.named)
  .concat(fixtures.arrows)
  .map((item) => `async ${item}`);

// const regulars = [
//   {
//     name: null,
//     params: 'a, cb, restArgs',
//     args: ['a', 'cb', 'restArgs'],
//     body: 'return a * 3',
//     defaults: {
//       a: '{foo: "ba)r", baz: 123}',
//       cb: undefined,
//       restArgs: undefined,
//     },
//   },
//   {
//     name: null,
//     params: 'b, callback, restArgs',
//     args: ['b', 'callback', 'restArgs'],
//     body: 'callback(null, b + 3)',
//     defaults: { b: undefined, callback: undefined, restArgs: undefined },
//   },
//   {
//     name: null,
//     params: 'c',
//     args: ['c'],
//     body: 'return c * 3',
//     defaults: { c: undefined },
//   },
//   {
//     name: null,
//     params: 'restArgs',
//     args: ['restArgs'],
//     body: 'return 321',
//     defaults: { restArgs: undefined },
//   },
//   {
//     name: null,
//     params: '',
//     args: [],
//     body: '',
//     defaults: {},
//   },
//   {
//     name: null,
//     params: 'a',
//     args: ['a'],
//     body: '',
//     defaults: { a: 'false' },
//   },
//   {
//     name: null,
//     params: 'a',
//     args: ['a'],
//     body: '',
//     defaults: { a: 'null' },
//   },
//   {
//     name: null,
//     params: 'a',
//     args: ['a'],
//     body: '',
//     defaults: { a: '"bar"' },
//   },
//   {
//     name: null,
//     params: 'a, b',
//     args: ['a', 'b'],
//     body: '',
//     defaults: { a: undefined, b: 'true' },
//   },
//   {
//     name: null,
//     params: 'a',
//     args: ['a'],
//     body: '',
//     defaults: { a: '1' },
//   },
// ];

/**
 * All of the regular functions
 * variants plus few more
 */

// const arrows = clone(regulars).concat([
//   {
//     name: null,
//     params: 'a',
//     args: ['a'],
//     body: 'a * 3 * a',
//     defaults: { a: undefined },
//   },
//   {
//     name: null,
//     params: 'd',
//     args: ['d'],
//     body: 'd * 355 * d',
//     defaults: { d: undefined },
//   },
//   {
//     name: null,
//     params: 'e',
//     args: ['e'],
//     body: 'return e + 5235 / e',
//     defaults: { e: undefined },
//   },
//   {
//     name: null,
//     params: 'a, b',
//     args: ['a', 'b'],
//     body: 'a + 3 + b',
//     defaults: { a: undefined, b: undefined },
//   },
//   {
//     name: null,
//     params: 'x, y, restArgs',
//     args: ['x', 'y', 'restArgs'],
//     body: 'console.log({ value: x * y })',
//     defaults: { x: undefined, y: undefined, restArgs: undefined },
//   },
// ]);

/**
 * All of the regulars, but
 * with different name
 */

// const named = clone(regulars).map((item) => ({ ...item, name: 'namedFn' }));

// const expectedResults = {
//   regulars,
//   named,
//   generators: named,
//   arrows,
//   asyncs: regulars.concat(named).concat(arrows),
// };

let testsCount = 1;

/**
 * Factory for DRY, we run all tests
 * over two available parsers - one
 * is the default `babylon`, second is
 * the `acorn.parse` method.
 */

function factory(parserName, parseFn) {
  forIn(fixtures, (values) => {
    values.forEach((code) => {
      const actual = parseFn(code);
      // const expected = expectedResults[key][i];
      const value = actual.value.replace(/^\(\{? ?/, '').replace(/\)$/, '');

      test(`#${testsCount++} - ${parserName} - ${value}`, () => {
        expect(actual).toMatchSnapshot();
      });
    });
  });

  test(`#${testsCount++} - ${parserName} - should return object with default values when invalid`, () => {
    const actual = parseFn(123456);

    expect(actual).toMatchSnapshot();
    // test.strictEqual(actual.isValid, false);
    // test.strictEqual(actual.value, '');
    // test.strictEqual(actual.name, null);
    // test.strictEqual(actual.body, '');
    // test.strictEqual(actual.params, '');
    // test.deepEqual(actual.args, []);
  });

  test(`#${testsCount++} - ${parserName} - should have '.isValid' and few '.is*'' hidden properties`, () => {
    const actual = parseFn([1, 2, 3]);

    expect(actual).toMatchSnapshot();
    // test.strictEqual(actual.isValid, false);
    // test.strictEqual(actual.isArrow, false);
    // test.strictEqual(actual.isAsync, false);
    // test.strictEqual(actual.isNamed, false);
    // test.strictEqual(actual.isAnonymous, false);
    // test.strictEqual(actual.isGenerator, false);
    // test.strictEqual(actual.isExpression, false);
  });

  // bug in v4 and v5
  // https://github.com/tunnckoCore/parse-function/issues/3
  // test(`#${testsCount++} - ${parserName} - should not fails to get .body when something after close curly`,  () => {
  //   const actual = parseFn('function (a) {return a * 2}; var b = 1')
  //   expect(actual.body, 'return a * 2')
  //   done()
  // })

  test(`#${testsCount++} - ${parserName} - should work when comment in arguments (see #11)`, () => {
    const actual = parseFn('function (/* done */) { return 123 }');
    expect(actual.params).toStrictEqual('');
    expect(actual.body).toStrictEqual(' return 123 ');

    const res = parseFn('function (foo/* done */, bar) { return 123 }');
    expect(res.params).toStrictEqual('foo, bar');
    expect(res.body).toStrictEqual(' return 123 ');
  });

  test(`#${testsCount++} - ${parserName} - should support to parse generator functions`, () => {
    const actual = parseFn('function * named (abc) { return abc + 123 }');
    expect(actual.name).toStrictEqual('named');
    expect(actual.params).toStrictEqual('abc');
    expect(actual.body).toStrictEqual(' return abc + 123 ');
  });

  test(`#${testsCount++} - ${parserName} - should support to parse async functions (ES2016)`, () => {
    const actual = parseFn('async function foo (bar) { return bar }');
    expect(actual.name).toStrictEqual('foo');
    expect(actual.params).toStrictEqual('bar');
    expect(actual.body).toStrictEqual(' return bar ');
  });

  test(`#${testsCount++} - ${parserName} - should parse a real function which is passed`, () => {
    const actual = parseFn(function fooBar(a, bc) {
      return a + bc;
    });
    expect(actual.name).toStrictEqual('fooBar');
    expect(actual.params).toStrictEqual('a, bc');
    expect(actual.body).toStrictEqual('\n      return a + bc;\n    ');
  });

  test(`#${testsCount++} - ${parserName} - should work for object methods`, () => {
    const obj = {
      // eslint-disable-next-line no-unused-vars
      foo(a, b, c) {
        return 123;
      },
      bar(a) {
        return () => a;
      },
      *gen(a) {
        return yield a * 321;
      },
    };

    const foo = parseFn(obj.foo);
    expect(foo).toMatchSnapshot();
    // expect(foo.name, 'foo');
    // expect(foo.params, 'a, b, c');
    // expect(foo.body, '\n        return 123;\n      ');

    const bar = parseFn(obj.bar);
    expect(bar).toMatchSnapshot();
    // expect(bar.name, 'bar');
    // expect(bar.body, '\n        return () => a;\n      ');

    const gen = parseFn(obj.gen);
    expect(gen).toMatchSnapshot();
    // expect(gen.name).toStrictEqual('gen');

    const namedFn = `namedFn (a = {foo: 'ba)r', baz: 123}, cb, ...restArgs) { return a * 3 }`;
    const namedFnc = parseFn(namedFn);
    expect(namedFnc).toMatchSnapshot();
    // expect(namedFnc.name).toStrictEqual('namedFn');
    // expect(namedFnc.args.length).toStrictEqual(3);
    // expect(namedFnc.body).toStrictEqual(' return a * 3 ');
  });

  test(`#${testsCount++} - ${parserName} - plugins api`, () => {
    const fnStr = `() => 123 + a + 44`;
    // eslint-disable-next-line no-unused-vars
    const plugin = (app) => (node, result) => {
      // eslint-disable-next-line no-param-reassign
      result.called = true;
      // you may want to return the `result`,
      // but it is the same as not return it
      // return result
    };
    const result = parseFn(fnStr, {}, plugin);

    expect(result.called).toStrictEqual(true);
  });

  test(`#${testsCount++} - ${parserName} - fn named "anonymous" has .name: 'anonymous'`, () => {
    const result = parseFn('function anonymous () {}');
    expect(result.name).toStrictEqual('anonymous');
    expect(result.isAnonymous).toStrictEqual(false);
  });

  test(`#${testsCount++} - ${parserName} - real anonymous fn has .name: null`, () => {
    const actual = parseFn('function () {}');
    expect(actual.name).toBeNull();
    expect(actual.isAnonymous).toStrictEqual(true);
  });
}

/**
 * Actually run all the tests
 */

factory('babel (default)', (code, opts, plugin) => {
  const app = parseFunction();
  if (plugin) app.use(plugin);
  return app.parse(code, opts);
});

factory('options.parse + ecmaVersion: 2019', (code, opts, plugin) => {
  const app = parseFunction({
    parse: babylonParse,
    ecmaVersion: 2019,
  });
  if (plugin) app.use(plugin);
  return app.parse(code, opts);
});

factory('acorn.parse', (code, opts, plugin) => {
  const app = parseFunction({
    parse: acornParse,
    ecmaVersion: 2017,
  });
  if (plugin) app.use(plugin);
  return app.parse(code, opts);
});

factory('acorn loose', (code, opts, plugin) => {
  const app = parseFunction();
  if (plugin) app.use(plugin);
  return app.parse(code, {
    parse: acornLooseParse,
    ecmaVersion: 2017,
    ...opts,
  });
});

factory('espree.parse', (code, opts, plugin) => {
  const app = parseFunction({
    parse: espreeParse,
    ecmaVersion: 8,
  });
  if (plugin) app.use(plugin);
  return app.parse(code, opts);
});

test('should just extend the core API, not the end result', () => {
  const app = parseFunction();
  app.use((inst) => {
    app.define(inst, 'hello', (place) => `Hello ${place}!!`);
  });
  const ret = app.hello('pinky World');
  expect(ret).toStrictEqual('Hello pinky World!!');
});

test('should call fn returned from plugin only when `parse` is called', () => {
  const app = parseFunction({
    ecmaVersion: 2017,
  });

  let called = 0;

  app.use(() => {
    called = 1;
    return () => {
      called = 2;
    };
  });

  expect(called).toStrictEqual(1);

  const res = app.parse('(a, b) => {}');
  expect(called).toStrictEqual(2);
  expect(res.params).toStrictEqual('a, b');
});

// https://github.com/tunnckoCore/parse-function/issues/61
test('should work with an async arrow function with an `if` statement', () => {
  const app = parseFunction();
  const parsed = app.parse('async (v) => { if (v) {} }');
  expect(parsed).toMatchSnapshot();
});

test(`fn named "anonymous" has .name: 'anonymous'`, () => {
  const app = parseFunction({ ecmaVersion: 2017 });
  const result = app.parse(function anonymous() {});

  expect(result.name).toStrictEqual('anonymous');
  expect(result.isAnonymous).toStrictEqual(false);
});

test(`real anonymous fn has .name: null`, () => {
  const app = parseFunction({ ecmaVersion: 2017 });

  /* eslint-disable-next-line prefer-arrow-callback, func-names */
  const actual = app.parse(function() {});
  expect(actual.name).toBeNull();
  expect(actual.isAnonymous).toStrictEqual(true);
});
