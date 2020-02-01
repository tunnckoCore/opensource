/* eslint-disable no-param-reassign, unicorn/consistent-function-scoping */

/**
 * > Micro plugin to get the raw body, without the
 * surrounding curly braces. It also preserves
 * the whitespaces and newlines - they are original.
 *
 * @param  {object} `node`
 * @param  {object} `result`
 * @return {object} `result`
 * @private
 */
export default () => (node, result) => {
  result.body = result.value.slice(node.body.start, node.body.end);

  const openCurly = result.body.charCodeAt(0) === 123;
  const closeCurly = result.body.charCodeAt(result.body.length - 1) === 125;

  if (openCurly && closeCurly) {
    result.body = result.body.slice(1, -1);
  }

  return result;
};
