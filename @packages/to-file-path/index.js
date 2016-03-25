/*!
 * to-file-path <https://github.com/tunnckoCore/to-file-path>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

/**
 * > Create filepath from different type of arguments.
 *
 * **Example**
 *
 * ```js
 * var toFilePath = require('to-file-path')
 *
 * console.log(toFilePath('foo.bar.baz')) // => 'foo/bar/baz'
 * console.log(toFilePath('foo.bar', 'qux.baz', 'xxx')) // => 'foo/bar/qux/baz/xxx'
 * console.log(toFilePath('foo', 'qux', 'baz')) // => 'foo/qux/baz'
 * console.log(toFilePath([1, 2, 3], 'foo', 4, 'bar')) // => '1/2/3/foo/4/bar'
 * console.log(toFilePath(null, true)) // => 'null/true'
 * console.log(toFilePath(1, 2, 3)) // => '1/2/3'
 * ```
 *
 * @param  {String|Array|Arguments|Number|Boolean} `args` Pass any type and any number of arguments.
 * @return {String} always slash separated filepath
 * @api public
 */

module.exports = function toFilePath (args) {
  if (arguments.length > 1) {
    return toFilePath(arguments)
  }
  if (utils.isArray(args) || utils.isArguments(args)) {
    return utils.map(args, function (val) {
      return toFilePath(val)
    }).join('/')
  }
  if (typeof args === 'string') {
    return args.split('.').join('/')
  }
  if (typeof args === 'object') {
    args = JSON.stringify(args)
  }
  return toFilePath(String(args))
}
