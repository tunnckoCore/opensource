'use strict'

/**
 * Module dependencies
 */

var utils = {}
utils.extend = require('extend-shallow')
utils.formidable = require('formidable')
utils.querystring = require('querystring')
utils.bodyParsers = require('koa-body-parsers')

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
  options = utils.extend(
    {
      fields: false,
      files: false,
      multipart: true,
      textLimit: false,
      formLimit: false,
      jsonLimit: false,
      jsonStrict: true,
      detectJSON: false,
      bufferLimit: false,
      buffer: false,
      strict: true,

      // query string `parse` options
      delimiter: '&',
      decodeURIComponent: utils.querystring.unescape,
      maxKeys: 1000
    },
    options
  )

  options.delimiter = options.sep || options.delimiter
  options.formLimit = options.formLimit || options.urlencodedLimit
  options.extendTypes = types
  options.onerror = options.onЕrror || options.onerror
  options.onerror =
    typeof options.onerror === 'function' ? options.onerror : false
  options.delimiter =
    typeof options.delimiter === 'string' ? options.delimiter : '&'

  if (typeof options.handler !== 'function') {
    options.handler = function * noopHandler () {}
  }
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
  return utils.extend(
    {
      multipart: ['multipart/form-data'],
      text: ['text/*'],
      form: ['application/x-www-form-urlencoded'],
      json: [
        'application/json',
        'application/json-patch+json',
        'application/vnd.api+json',
        'application/csp-report'
      ],
      buffer: ['text/*']
    },
    types
  )
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
 * @param  {Object} `opts` default options
 * @return {Object} `ctx` koa context
 * @api private
 */
utils.setParsers = function setParsers (ctx, opts) {
  ctx.app.querystring =
    opts.querystring ||
    opts.qs || // alias
    (ctx.app && ctx.app.querystring) ||
    (ctx.app && ctx.app.qs) || // alias
    ctx.qs // alias

  utils.bodyParsers(ctx)
  ctx.request.multipart = utils.multipart.bind(ctx)
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
utils.multipart = function multipart (opts) {
  var ctx = this

  return function thunk (done) {
    var fields = {}
    var fileFields = {}
    var files = []
    var form =
      opts.IncomingForm instanceof utils.formidable.IncomingForm
        ? opts.IncomingForm
        : new utils.formidable.IncomingForm(opts)

    form.on('error', done)
    form.on('aborted', done)
    form.on('file', function (name, file) {
      files.push(file)
      fileFields[name] = fileFields[name] || []
      fileFields[name].push(file)
    })
    form.on('field', function (name, field) {
      if (fields.hasOwnProperty(name)) {
        if (Array.isArray(fields[name])) {
          fields[name].push(field)
        } else {
          fields[name] = [fields[name], field]
        }
      } else {
        fields[name] = field
      }
    })
    form.on('end', function () {
      done(null, {
        fields: Object.assign({}, fields, fileFields),
        files: files
      })
    })
    form.parse(ctx.req)
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
// eslint-disable-next-line complexity
utils.parseBody = function * parseBody (ctx, options, next) {
  var fields = typeof options.fields === 'string' ? options.fields : 'fields'
  var files = typeof options.files === 'string' ? options.files : 'files'
  var custom = options.extendTypes.custom

  if (custom && custom.length && ctx.request.is(custom)) {
    yield * options.handler.call(ctx, ctx, options, next)
    return yield * next
  }
  if (options.detectJSON(ctx) || ctx.request.is(options.extendTypes.json)) {
    ctx.app.jsonStrict =
      typeof options.jsonStrict === 'boolean' ? options.jsonStrict : true
    ctx.request[fields] = yield ctx.request.json(options.jsonLimit)
    return yield * next
  }
  if (
    ctx.request.is(options.extendTypes.form || options.extendTypes.urlencoded)
  ) {
    var res = yield ctx.request.urlencoded(options.formLimit)
    ctx.request[fields] = res
    return yield * next
  }
  if (options.buffer && ctx.request.is(options.extendTypes.buffer)) {
    ctx.request.body = yield ctx.request.buffer(options.bufferLimit)
    return yield * next
  }
  if (ctx.request.is(options.extendTypes.text)) {
    var limit = options.textLimit
    var body = yield ctx.request.text(limit)

    ctx.request.body = body
    return yield * next
  }
  if (options.multipart && ctx.request.is(options.extendTypes.multipart)) {
    var result = yield ctx.request.multipart(options)
    ctx.request[fields] = result.fields
    ctx.request[files] = result.files
    return yield * next
  }
}

/**
 * Expose `utils` modules
 */

module.exports = utils
