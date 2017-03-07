/*!
 * parse-function <https://github.com/tunnckoCore/parse-function>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

const body = require('./body')
const props = require('./props')
const params = require('./params')

/**
 * > Default plugin that handles regular functions,
 * arrow functions, generator functions
 * and ES6 object method notation.
 *
 * @param  {Object} `node`
 * @param  {Object} `result`
 * @return {Object} `result`
 * @api private
 */

module.exports = (app) => (node, result) => {
  const isFn = node.type.endsWith('FunctionExpression')
  const isMethod = node.type === 'ObjectExpression'

  /* istanbul ignore next */
  if (!isFn && !isMethod) {
    return
  }

  node = isMethod ? node.properties[0] : node
  node.id = isMethod ? node.key : node.id

  // babylon node.properties[0] is `ObjectMethod` that has `params` and `body`;
  // acorn node.properties[0] is `Property` that has `value`;
  if (node.type === 'Property') {
    const id = node.key
    node = node.value
    node.id = id
  }

  result = props(app)(node, result)
  result = params(app)(node, result)
  result = body(app)(node, result)

  return result
}
