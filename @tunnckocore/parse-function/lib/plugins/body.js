/*!
 * parse-function <https://github.com/tunnckoCore/parse-function>
 *
 * Copyright (c) 2017 Charlike Mike Reagent <open.source.charlike@gmail.com> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

/**
 * > Micro plugin to get the raw body, without the
 * surrounding curly braces. It also preserves
 * the whitespaces and newlines - they are original.
 *
 * @param  {Object} `node`
 * @param  {Object} `result`
 * @return {Object} `result`
 * @api private
 */

module.exports = (app) => (node, result) => {
  result.body = result.value.slice(node.body.start, node.body.end)

  const openCurly = result.body.charCodeAt(0) === 123
  const closeCurly = result.body.charCodeAt(result.body.length - 1) === 125

  if (openCurly && closeCurly) {
    result.body = result.body.slice(1, -1)
  }

  return result
}
