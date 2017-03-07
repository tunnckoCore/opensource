/*!
 * parse-function <https://github.com/tunnckoCore/parse-function>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

/**
 * > Micro plugin to visit each of the params
 * in the given function and collect them into
 * an `result.args` array and `result.params` string.
 *
 * @param  {Object} `node`
 * @param  {Object} `result`
 * @return {Object} `result`
 * @api private
 */

module.exports = (app) => (node, result) => {
  if (!node.params.length) {
    return result
  }

  node.params.forEach((param) => {
    const defaultArgsName = param.type === 'AssignmentPattern' &&
      param.left &&
      param.left.name

    const restArgName = param.type === 'RestElement' &&
      param.argument &&
      param.argument.name

    const name = param.name || defaultArgsName || restArgName

    result.args.push(name)
    result.defaults[name] = param.right
      ? result.value.slice(param.right.start, param.right.end)
      : undefined
  })
  result.params = result.args.join(', ')

  return result
}
