/**
 * parse-function <https://github.com/tunnckoCore/parse-function>
 *
 * Copyright (c) 2014-2015 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict'

var fnRegex = require('function-regex')

/**
 * Parse a given function or string (fn.toString()) to object
 * with `name`, `params`, `parameters`, `args`, `arguments` and `body` properties.
 *
 * **Example:**
 *
 * ```js
 * var parseFunction = require('parse-function');
 *
 * var fixture = 'function testing(val, re, beta) { return true; }';
 * var actual = parseFunction(fixture);
 * //=> actual = {
 * //  name: 'testing',
 * //  params: 'val, re, beta',
 * //  parameters: 'val, re, beta',
 * //  args: ['val', 're', 'beta'],
 * //  arguments: ['val', 're', 'beta'],
 * //  body: ' return true; '
 * //};
 *
 * var unnamed = function() {};
 * var res = parseFunction(unnamed);
 * //=> res = {
 * //  name: 'anonymous',
 * //  params: '',
 * //  parameters: '',
 * //  args: [],
 * //  arguments: [],
 * //  body: ''
 * //};
 * ```
 *
 * @name parseFunction
 * @param  {Function|String} `[fn]`
 * @return {Object}
 * @api public
 */
module.exports = function parseFunction (fn) {
  if (typeof fn === 'function') {
    fn = fn.toString()
  }
  var match = fnRegex().exec(fn)

  var _parameters = match[2] || ''
  var _arguments = match[2].length && match[2].replace(/\s/g, '').split(',') || []

  return {
    name: match[1] || 'anonymous',
    params: _parameters,
    parameters: _parameters,
    args: _arguments,
    arguments: _arguments,
    body: match[3] || ''
  }
}
