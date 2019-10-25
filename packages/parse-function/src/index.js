/* eslint-disable node/file-extension-in-import, import/extensions, import/prefer-default-export */

import arrayify from 'arrify';

import { setDefaults, getNode } from './utils.js';
import basePlugin from './plugins/initial.js';

/**
 * Parse a given `input` and returns a `Result` object
 * with useful properties - such as `name`, `body` and `args`.
 * By default it uses `@babel/parser` parser, but you can switch it by
 * passing `options.parse` or `options.parseExpression`, for example `options.parse: acorn.parse`.
 * In the below example will show how to use `acorn` parser, instead
 * of the default one.
 *
 * @example
 * import { parse as acornParse } from 'acorn';
 * import { parse as espreeParse } from 'espree';
 * import { parseFunction } from 'parse-function';
 *
 * // or in CommonJS
 * // const { parseFunction } = require('parse-function');
 * // const parseFunction = require('parse-function').parseFunction;
 * // const fn = require('parse-function');
 * // fn.parseFunction()
 *
 * function fooFn(bar, baz = 123) { return bar + baz; };
 *
 * const result1 = parseFunction(fooFn, { parse: acornParse });
 * console.log(result1);
 *
 * const result2 = parseFunction(fooFn, {
 *   parse: espreeParse,
 *   parserOptions: {
 *     ecmaVersion: 9,
 *     sourceType: 'module',
 *     ecmaFeatures: { jsx: true, globalReturn: true },
 *   },
 * });
 *
 * console.log('parsed with espree', result2);
 * // => {
 * //  name: 'fooFn',
 * //  body: '\n  return bar + baz;\n',
 * //  args: [ 'bar', 'baz' ],
 * //  params: 'bar, baz',
 * //  defaults: { bar: undefined, baz: '123' },
 * //  value: '(function fooFn(bar, baz = 123) {\n  return bar + baz;\n})',
 * //  isValid: true,
 * //  isArrow: false,
 * //  isAsync: false,
 * //  isNamed: true,
 * //  isAnonymous: false,
 * //  isGenerator: false,
 * //  isExpression: false,
 * //  bobby: 'bobby',
 * //  barry: 'barry barry',
 * //  hasDefaultParams: true
 * // }
 *
 * function basicPlugin(node, result) {
 *   const bar = 'barry';
 *   const hasDefaultParams =
 *     Object.values(result.defaults).filter(Boolean).length > 0;
 *
 *   return { ...result, foo: 123, bar, hasDefaultParams };
 * }
 *
 * const resultWithPlugins = parseFunction(fooFn, { plugins: basicPlugin });
 * console.log(resultWithPlugins.name); // => 'fooFn'
 * console.log(resultWithPlugins.foo); // => 123
 * console.log(resultWithPlugins.bar); // => 'barry'
 * console.log(resultWithPlugins.hasDefaultParams); // => true
 *
 * @param  {Function|String} `input` any kind of function or string to be parsed
 * @param  {Options} `options` directly passed to the parser - babylon, acorn, espree
 * @param  {Function} `options.parse` by default `@babel/parser`'s `.parse` or `.parseExpression`,
 * @param  {ParserOptions} `options.parserOptions` passed to the parser
 * @param  {Plugins} `options.plugins` a plugin function like `function plugin(node: Node, result: Result): Result {}`
 * @return {Result} `result` object of the `Result`, see [result section](#result) for more info
 * @name   .parseFunction
 * @api public
 */
export function parseFunction(input, options) {
  const opts = { ...options };
  const result = setDefaults(input);

  if (!result.isValid) {
    return result;
  }

  const isFunction = result.value.startsWith('function');
  const isAsyncFn = result.value.startsWith('async function');
  const isAsync = result.value.startsWith('async');
  const isArrow = result.value.includes('=>');
  const isAsyncArrow = isAsync && isArrow;

  const isMethod = /^\*?.+\([\s\S\w\W]*\)\s*\{/i.test(result.value);

  if (!(isFunction || isAsyncFn || isAsyncArrow) && isMethod) {
    result.value = `{ ${result.value} }`;
  }

  const node = getNode(result, opts, opts.parse);
  const plugins = arrayify(opts.plugins);

  return [basePlugin, ...plugins].filter(Boolean).reduce((res, fn) => {
    const pluginResult = fn(node, { ...res }) || res;

    return { ...res, ...pluginResult };
  }, result);
}
