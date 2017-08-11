/*!
 * parse-function <https://github.com/tunnckoCore/parse-function>
 *
 * Copyright (c) 2017 Charlike Mike Reagent <open.source.charlike@gmail.com> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

/* eslint-disable jsdoc/require-param-description, jsdoc/check-param-names */

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
 * @param  {Object} node
 * @param  {Object} result
 * @return {Object} result
 * @private
 */
export default (app) => (node, result) => {
  app.define(result, 'isArrow', node.type.startsWith('Arrow'))
  app.define(result, 'isAsync', node.async || false)
  app.define(result, 'isGenerator', node.generator || false)
  app.define(result, 'isExpression', node.expression || false)
  app.define(result, 'isAnonymous', node.id === null)
  app.define(result, 'isNamed', !result.isAnonymous)

  // if real anonymous -> set to null,
  // notice that you can name you function `anonymous`, haha
  // and it won't be "real" anonymous, so `isAnonymous` will be `false`
  result.name = result.isAnonymous ? null : node.id.name

  return result
}
