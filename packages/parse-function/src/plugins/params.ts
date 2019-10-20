import { Result } from '../types';

/* eslint-disable no-param-reassign, @typescript-eslint/no-explicit-any */

/**
 * > Micro plugin to visit each of the params
 * in the given function and collect them into
 * an `result.args` array and `result.params` string.
 *
 * @param  node
 * @param  result
 * @return result
 * @private
 */
export default (node: any, result: Result): Result => {
  node.params.forEach((param: any) => {
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
