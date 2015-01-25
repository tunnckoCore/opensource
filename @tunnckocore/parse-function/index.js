/**
 * parse-function <https://github.com/tunnckoCore/parse-function>
 *
 * Copyright (c) 2014-2015 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict';

var functionRegex = require('function-regex');

/**
 * Parse given function or string to object with
 * properties `name`, `args`, `arguments` and `body`
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
 * //  args: ['val', 're', 'beta'],
 * //  arguments: 'val, re, beta',
 * //  body: ' return true; '
 * //};
 *
 * var unnamed = function() {};
 * var res = parseFunction(unnamed);
 * //=> res = {
 * //  name: 'anonymous',
 * //  args: [],
 * //  arguments: '',
 * //  body: ''
 * //};
 * ```
 *
 * @name parseFunction
 * @param  {Function|String} `[fn]`
 * @return {Object}
 * @api public
 */
module.exports = function parseFunction(fn) {
  if (typeof fn === 'function') {
    fn = fn.toString();
  }
  var match = functionRegex().exec(fn);

  return {
    name: match[1] || 'anonymous',
    args: match[2].length ? match[2].replace(/\s/g, '').split(',') : [],
    arguments: match[2] || '',
    body: match[3] || ''
  };
};
