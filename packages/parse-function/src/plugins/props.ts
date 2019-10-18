/* eslint-disable @typescript-eslint/no-explicit-any */

import { Result } from '../types';

/**
 * > Set couple of hidden properties and
 * the name of the given function to
 * the returned result object. Notice that
 * if function is called "anonymous" then
 * the `result.isAnonymous` would be `false`, because
 * in reality it is named function. It would be `true`
 * only when function is really anonymous and don't have
 * any name.
 *
 * @param  node
 * @param  result
 * @return result
 * @private
 */
export default (node: any, result: Result): Result => {
  const res = {
    ...result,
    isArrow: node.type.startsWith('Arrow'),
    isAsync: node.async || false,
    isGenerator: node.generator || false,
    isExpression: node.expression || false,
    isAnonymous: node.id === null,
    isNamed: node.id !== null,

    // if real anonymous -> set to null,
    // notice that you can name you function `anonymous`, haha
    // and it won't be "real" anonymous, so `isAnonymous` will be `false`

    name: node.id === null ? null : node.id.name,
  };

  return res;
};
