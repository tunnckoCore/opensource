/* eslint-disable no-param-reassign, @typescript-eslint/no-explicit-any */

import { Result } from '../types';

import bodyPlugin from './body';
import propsPlugin from './props';
import paramsPlugin from './params';

/**
 * > Default plugin that handles regular functions,
 * arrow functions, generator functions
 * and ES6 object method notation.
 *
 * @param  node
 * @param  result
 * @return resul
 * @private
 */
export default (node: any, result: Result): Result => {
  const isFn = node.type.endsWith('FunctionExpression');
  const isMethod = node.type === 'ObjectExpression';

  /* istanbul ignore next */
  if (!isFn && !isMethod) {
    return result;
  }

  node = isMethod ? node.properties[0] : node;
  node.id = isMethod ? node.key : node.id;

  // babylon node.properties[0] is `ObjectMethod` that has `params` and `body`;
  // acorn node.properties[0] is `Property` that has `value`;
  if (node.type === 'Property') {
    const id = node.key;
    node = node.value;
    node.id = id;
  }

  result = bodyPlugin(node, result);
  result = propsPlugin(node, result);
  result = paramsPlugin(node, result);

  return result;
};
