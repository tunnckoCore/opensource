/*!
 * parse-function <https://github.com/tunnckoCore/parse-function>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

const arrayify = require('arrify')
const babylon = require('babylon')
const define = require('define-property')

const utils = {}
utils.define = define
utils.arrayify = arrayify

/**
 * > Create default result object,
 * and normalize incoming arguments.
 *
 * @param  {Function|String} `code`
 * @return {Object} result
 * @api private
 */

utils.setDefaults = function setDefaults (code) {
  const result = {
    name: null,
    body: '',
    args: [],
    params: ''
  }

  if (typeof code === 'function') {
    code = code.toString('utf8')
  }

  if (typeof code !== 'string') {
    code = '' // makes result.isValid === false
  }

  return utils.setHiddenDefaults(result, code)
}

/**
 * > Create hidden properties into
 * the result object.
 *
 * @param  {Object} `result`
 * @param  {Function|String} code
 * @return {Object} result
 * @api private
 */

utils.setHiddenDefaults = function setHiddenDefaults (result, code) {
  utils.define(result, 'defaults', {})
  utils.define(result, 'value', code)
  utils.define(result, 'isValid', code.length > 0)
  utils.define(result, 'isArrow', false)
  utils.define(result, 'isAsync', false)
  utils.define(result, 'isNamed', false)
  utils.define(result, 'isAnonymous', false)
  utils.define(result, 'isGenerator', false)
  utils.define(result, 'isExpression', false)

  return result
}

/**
 * > Get needed AST tree, depending on what
 * parse method is used.
 *
 * @param  {Object} `result`
 * @param  {Object} `opts`
 * @return {Object} `node`
 * @api private
 */

utils.getNode = function getNode (result, opts) {
  if (typeof opts.parse === 'function') {
    result.value = `(${result.value})`

    const ast = opts.parse(result.value, opts)
    const body = (ast.program && ast.program.body) || ast.body

    return body[0].expression
  }

  return babylon.parseExpression(result.value, opts)
}

module.exports = utils
