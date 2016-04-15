/*!
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 *
 * Copyright (c) 2014-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var test = require('assertit')

test('parse json body', function () {
  require('./test/json')
})

test('parse urlencoded body', function () {
  require('./test/urlencoded')
})

test('parse text body', function () {
  require('./test/text')
})

test('parse buffer body', function () {
  require('./test/buffer')
})

test('parse multipart body', function () {
  require('./test/multipart')
})

test('options and misc', function () {
  require('./test/options')
})
