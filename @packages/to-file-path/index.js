/*!
 * to-file-path <https://github.com/tunnckoCore/to-file-path>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

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
