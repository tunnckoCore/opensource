/* eslint-disable no-param-reassign, @typescript-eslint/no-explicit-any */

import { Result } from '../types';

/**
 * > Micro plugin to get the raw body, without the
 * surrounding curly braces. It also preserves
 * the whitespaces and newlines - they are original.
 *
 * @param  node
 * @param  result
 * @return result
 * @private
 */
export default (node: any, result: Result): Result => {
  let body = result.value.slice(node.body.start, node.body.end);

  const openCurly = body.charCodeAt(0) === 123;
  const closeCurly = body.charCodeAt(body.length - 1) === 125;

  if (openCurly && closeCurly) {
    body = body.slice(1, -1);
  }

  return { ...result, body };
};
