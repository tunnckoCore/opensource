/*!
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 *
 * Copyright (c) 2014-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

// parse json body
require('./test/json')

// parse urlencoded body
require('./test/urlencoded')

// parse text body
require('./test/text')

// parse buffer body
require('./test/buffer')

// parse multipart body
require('./test/multipart')

// options and misc
require('./test/options')
