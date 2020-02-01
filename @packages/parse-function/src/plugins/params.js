/* eslint-disable no-param-reassign, unicorn/consistent-function-scoping */

/**
 * > Micro plugin to visit each of the params
 * in the given function and collect them into
 * an `result.args` array and `result.params` string.
 *
 * @param  {object} `node`
 * @param  {object} `result`
 * @return {object} `result`
 * @private
 */
export default () => (node, result) => {
  node.params.forEach((param) => {
    const defaultArgsName =
      param.type === 'AssignmentPattern' && param.left && param.left.name;

    const restArgName =
      param.type === 'RestElement' && param.argument && param.argument.name;

    const name = param.name || defaultArgsName || restArgName;

    result.args.push(name);

    if (param.right && param.right.type === 'SequenceExpression') {
      const lastExpression = param.right.expressions.pop();

      result.defaults[name] = result.value.slice(
        lastExpression.start,
        lastExpression.end,
      );
    } else {
      result.defaults[name] = param.right
        ? result.value.slice(param.right.start, param.right.end)
        : undefined;
    }
  });
  result.params = result.args.join(', ');

  return result;
};
