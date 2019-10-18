/* eslint-disable @typescript-eslint/no-explicit-any */
import arrayify from 'arrify';
import { parse as babelParse } from '@babel/parser';

import { setDefaults, getNode } from './utils';
import { Input, Options, Plugin, Result } from './types';

import basePlugin from './plugins/initial';

// eslint-disable-next-line import/prefer-default-export
export function parseFunction(code: Input, options?: Options) {
  const opts: Options = { parse: babelParse, ...options };
  const result: Result = setDefaults(code);

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

  return [basePlugin, ...plugins]
    .filter(Boolean)
    .reduce((res: any, fn: Plugin) => {
      const pluginResult = fn(node, { ...res }) || res;

      return pluginResult;
    }, result);
}
