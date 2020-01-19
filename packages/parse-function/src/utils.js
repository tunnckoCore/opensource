/* eslint-disable no-param-reassign */
import arrayify from 'arrify';
import { parseExpression } from '@babel/parser';

const utils = {};

utils.arrayify = arrayify;

/**
 * > Create default result object,
 * and normalize incoming arguments.
 *
 * @param  {function|string} code
 * @return {object} result
 * @private
 */
utils.setDefaults = function setDefaults(code) {
  const result = {
    name: null,
    body: '',
    args: [],
    params: '',
  };

  if (typeof code === 'function') {
    code = code.toString('utf8');
  }

  // makes result.isValid === false
  if (typeof code !== 'string') {
    code = '';
  }

  return utils.setHiddenDefaults(result, code || '');
};

/**
 * > Create hidden properties into
 * the result object.
 *
 * @param  {object} result
 * @param  {Function|string} code
 * @return {object} result
 * @private
 */
utils.setHiddenDefaults = function setHiddenDefaults(result, code) {
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
};

/**
 * > Get needed AST tree, depending on what
 * parse method is used.
 *
 * @param  {object} result
 * @param  {object} opts
 * @return {object} node
 * @private
 */
utils.getNode = function getNode(result, opts) {
  if (typeof opts.parse === 'function') {
    result.value = `(${result.value})`;

    const ast = opts.parse(result.value, opts);
    const body = (ast.program && ast.program.body) || ast.body;

    return body[0].expression;
  }

  return parseExpression(result.value, opts);
};

export default utils;
