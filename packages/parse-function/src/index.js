/* eslint-disable node/file-extension-in-import, import/extensions */

import arrayify from 'arrify';
import { parse as babelParse } from '@babel/parser';

import { setDefaults, getNode } from './utils.js';
import basePlugin from './plugins/initial.js';

// eslint-disable-next-line import/prefer-default-export
export function parseFunction(code, options) {
  const opts = { parse: babelParse, ...options };
  const result = setDefaults(code);

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

  const node = getNode(result, opts);
  const plugins = arrayify(opts.plugins);

  return [basePlugin, ...plugins].filter(Boolean).reduce((res, fn) => {
    const pluginResult = fn(node, { ...res }) || res;

    return pluginResult;
  }, result);
}
