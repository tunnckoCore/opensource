'use strict'

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require)

/**
 * Temporarily re-assign `require` to trick browserify and
 * webpack into reconizing lazy dependencies.
 *
 * This tiny bit of ugliness has the huge dual advantage of
 * only loading modules that are actually called at some
 * point in the lifecycle of the application, whilst also
 * allowing browserify and webpack to find modules that
 * are depended on but never actually called.
 */

var fn = require
require = utils // eslint-disable-line no-undef, no-native-reassign

/**
 * Lazily required module dependencies
 */

require('extend-shallow', 'extend')
require('formidable')
require('koa-body-parsers', 'bodyParsers')

/**
 * Restore `require`
 */

require = fn // eslint-disable-line no-undef, no-native-reassign

/**
 * > Default options that will be loaded. Pass `options` to overwrite them.
 *
 * @param  {Object} `options`
 * @return {Object}
 * @api private
 */
utils.defaultOptions = function defaultOptions (options) {
  options = typeof options === 'object' ? options : {}
  var types = utils.defaultTypes(options.extendTypes)
  options = utils.extend({
    fields: false,
    files: false,
    multipart: true,
    textLimit: false,
    formLimit: false,
    jsonLimit: false,
    jsonStrict: true,
    detectJSON: false,
    bufferLimit: false,
    strict: true
  }, options)
  options.extendTypes = types
  options.onerror = options.onЕrror || options.onerror
  options.onerror = typeof options.onerror === 'function' ? options.onerror : false

  if (typeof options.detectJSON !== 'function') {
    options.detectJSON = function detectJSON () {
      return false
    }
  }

  return options
}

/**
 * > Only extend/overwrite default accept types.
 *
 * @param  {Object} `types`
 * @return {Object}
 * @api private
 */
utils.defaultTypes = function defaultTypes (types) {
  types = typeof types === 'object' ? types : {}
  return utils.extend({
    multipart: [
      'multipart/form-data'
    ],
    text: [
      'text/*'
    ],
    form: [
      'application/x-www-form-urlencoded'
    ],
    json: [
      'application/json',
      'application/json-patch+json',
      'application/vnd.api+json',
      'application/csp-report'
    ]
  }, types)
}

/**
 * > Is "valid" request method, according to IETF Draft.
 *
 * @see   https://tools.ietf.org/html/draft-ietf-httpbis-p2-semantics-19#section-6.1
 * @param  {String} `method` koa request method
 * @return {Boolean}
 * @api private
 */
utils.isValid = function isValid (method) {
  return ['GET', 'HEAD', 'DELETE'].indexOf(method.toUpperCase()) === -1
}

/**
 * > Add `koa-body-parsers` to the koa context. In addition
 * also adds the formidable as multipart parser.
 *
 * @param  {Object} `ctx` koa context
 * @return {Object} `ctx` koa context
 * @api private
 */
utils.setParsers = function setParsers (ctx) {
  utils.bodyParsers(ctx)
  ctx.request.multipart = utils.multipart
  return ctx
}

/**
 * > Formidable wrapper as multipart parser to make
 * thunk that later can be yielded. Also allows you to pass
 * formidable.IncomingForm instance to `options.IncomingForm`.
 *
 * @param  {Object} `options` passed or default plugin options
 * @param  {Object} `ctx` koa context
 * @return {Function} thunk
 * @api private
 */
utils.multipart = function multipart (options, ctx) {
  options = utils.defaultOptions(options)

  return function thunk (done) {
    var fields = {}
    var files = {}
    var form = options.IncomingForm instanceof utils.formidable.IncomingForm
      ? options.IncomingForm
      : new utils.formidable.IncomingForm(options)

    form.on('error', done)
    form.on('file', utils.handleMultiple(files))
    form.on('field', utils.handleMultiple(fields))
    form.on('end', function () {
      done(null, { fields: fields, files: files })
    })
    form.parse(ctx.req)
  }
}

/**
 * > Handles setting multiple values to same key, or multiple files.
 * For example input selects or forms for uploading multiple files.
 *
 * @param  {Object} `res` result object where will be written
 * @return {Function} event handler for formidable `file` and `field` events
 * @api private
 */
utils.handleMultiple = function handleMultiple (res) {
  return function handleFilesAndFields (name, value) {
    res[name] = res[name] ? [res[name]] : []
    res[name].push(value)
    res[name] = res[name].length > 1 ? res[name] : res[name][0]
  }
}

/**
 * > Parse a different type of request bodies. By default accepts
 * and can parse JSON, JSON-API, JSON-Patch, text, form, urlencoded
 * and buffer bodies.
 *
 * @param {Object}   `ctx` koa context
 * @param {Object}   `options` plugin options
 * @param {Function} `next` next middleware
 * @api private
 */
utils.parseBody = function * parseBody (ctx, options, next) { /* eslint complexity: [2, 12] */
  var fields = typeof options.fields === 'string' ? options.fields : 'fields'
  var files = typeof options.files === 'string' ? options.files : 'files'

  if (options.detectJSON(ctx) || ctx.request.is(options.extendTypes.json)) {
    ctx.app.jsonStrict = typeof options.jsonStrict === 'boolean' ? options.jsonStrict : true
    ctx.body = ctx.request[fields] = yield ctx.request.json(options.jsonLimit)
    return yield * next
  }
  if (ctx.request.is(options.extendTypes.form || options.extendTypes.urlencoded)) {
    var res = yield ctx.request.urlencoded(options.formLimit)
    ctx.body = ctx.request[fields] = res
    return yield * next
  }
  if (ctx.request.is(options.extendTypes.text)) {
    ctx.body = options.buffer
      ? yield ctx.request.buffer(options.bufferLimit || options.textLimit)
      : yield ctx.request.text(options.textLimit)
    return yield * next
  }
  if (options.multipart && ctx.request.is(options.extendTypes.multipart)) {
    var result = yield ctx.request.multipart(options, ctx)
    ctx.body = ctx.request[fields] = result.fields
    ctx.body[files] = ctx.request[files] = result.files
    return yield * next
  }
}

/**
 * Expose `utils` modules
 */

module.exports = utils
