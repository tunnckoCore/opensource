/* eslint-disable no-param-reassign */
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
 * @param  {object} `node`
 * @param  {object} `result`
 * @return {object} `result`
 * @private
 */
// eslint-disable-next-line unicorn/consistent-function-scoping
export default () => (node, result) => {
  result.isArrow = node.type.startsWith('Arrow');
  result.isAsync = node.async || false;
  result.isGenerator = node.generator || false;
  result.isExpression = node.expression || false;
  result.isAnonymous = node.id === null;
  result.isNamed = !result.isAnonymous;

  // if real anonymous -> set to null,
  // notice that you can name you function `anonymous`, haha
  // and it won't be "real" anonymous, so `isAnonymous` will be `false`

  result.name = result.isAnonymous ? null : node.id.name;

  return result;
};
