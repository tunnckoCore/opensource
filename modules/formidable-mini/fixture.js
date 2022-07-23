/*!
 * useful-error <https://github.com/tunnckoCore/useful-error>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict';

const util = require('util');
const utils = require('./utils');

module.exports = utils.errorBase('UsefulError', function (message, options) {
  if (typeof message === 'object') {
    options = message;
    message = false;
  }

  const format =
    options && typeof options.format === 'function'
      ? options.format
      : defaultFormat;
  const opts = utils.extend(
    {
      showStack: true,
      message: (message && message.length && message) || false,
    },
    options,
  );

  opts.message =
    typeof opts.message === 'function'
      ? opts.message.call(this, opts)
      : typeof opts.message === 'string'
      ? opts.message
      : '';

  utils.delegate(this, opts);
  utils.errorFormat(this, format);

  if (this.showStack === false && hasOwn(this, 'stack')) {
    delete this.stack;
  }
});

/**
 * > Default error `toString` method formatting.
 *
 * @param  {String} `headline`
 * @return {String}
 */

function defaultFormat(headline) {
  return util.format(
    '%s (at %s:%s:%s)',
    headline,
    this.filename,
    this.line,
    this.column,
  );
}

/**
 * > Has own property util.
 *
 * @param  {OBject}  `self`
 * @param  {String}  `key`
 * @return {Boolean}
 */

function hasOwn(self, key) {
  return Object.hasOwn(self, key);
}
