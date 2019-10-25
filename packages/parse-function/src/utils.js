/* eslint-disable no-param-reassign */
import { parseExpression } from '@babel/parser';

/**
 * > Create default result object,
 * and normalize incoming arguments.
 *
 * @param  code
 * @return result
 * @private
 */
export function setDefaults(code) {
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

export function setHiddenDefaults(result, code) {
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
export function getNode(result, options, parse) {
  const opts = { ...options };
  if (typeof parse === 'function') {
    result.value = `(${result.value})`;

    const ast = parse(result.value, opts.parserOptions);
    const astBody = ast.body;

    const body = (ast.program && ast.program.body) || astBody;

    return body[0].expression;
  }

  return typeof options.parseExpression === 'function'
    ? options.parseExpression(result.value, opts.parserOptions)
    : parseExpression(result.value, opts.parserOptions);
}
