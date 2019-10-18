/* eslint-disable no-param-reassign */

import { parseExpression } from '@babel/parser';
import { Options, Input, Result } from './types';

/**
 * > Create default result object,
 * and normalize incoming arguments.
 *
 * @param  code
 * @return result
 * @private
 */
export function setDefaults(code: Input): Result {
  const result = {
    name: null,
    body: '',
    args: [],
    params: '',
  };

  if (typeof code === 'function') {
    code = code.toString();
  }

  // makes result.isValid === false
  if (typeof code !== 'string') {
    code = '';
  }

  return setHiddenDefaults(result, code || '');
}

/**
 * > Create hidden properties into
 * the result object.
 *
 * @param   result
 * @param  code
 * @return  result
 * @private
 */

export function setHiddenDefaults(
  result: /* eslint-disable @typescript-eslint/no-explicit-any */ any,
  code: Input,
): Result {
  result.defaults = {};
  result.value = code;
  result.isValid = code.length > 0;
  result.isArrow = false;
  result.isAsync = false;
  result.isNamed = false;
  result.isAnonymous = false;
  result.isGenerator = false;
  result.isExpression = false;

  return result;
}

/**
 * > Get needed AST tree, depending on what
 * parse method is used.
 *
 * @param  result
 * @param  opts
 * @return node
 * @private
 */
export function getNode(result: Result, options?: Options): any {
  const opts: Options = { ...options };
  if (typeof opts.parse === 'function') {
    result.value = `(${result.value})`;

    const ast = opts.parse(result.value, opts.parserOptions);

    // for other parsers
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const astBody = ast.body;

    const body = (ast.program && ast.program.body) || astBody;

    // what the heck?!
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return body[0].expression;
  }

  return parseExpression(result.value, opts.parserOptions);
}
