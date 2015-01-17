/**
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 *
 * Copyright (c) 2014 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict';

/**
 * Module dependencies.
 */

var extend = require('extend');
var parse = require('co-body');
var formidable = require('formidable');

var defaults = {
  patchNode: false,
  patchKoa: true,
  multipart: false,
  fieldsKey: 'fields',
  filesKey: 'files',
  encoding: 'utf-8',
  jsonLimit: '1mb',
  formLimit: '56kb',
  formidable: {
    multiples: true,
    keepExtensions: true,
    maxFields: 10
  }
};

/**
 * @name  koaBetterBody
 *
 * @param {Object} `[options]`
 *   @option {String} [options] `jsonLimit` default '1mb'
 *   @option {String} [options] `formLimit` default '56kb'
 *   @option {String} [options] `encoding` default 'utf-8'
 *   @option {String} [options] `fieldsKey` default 'fields'
 *   @option {String} [options] `filesKey` default 'files'
 *   @option {Boolean} [options] `patchNode` default false
 *   @option {Boolean} [options] `patchKoa` default true
 *   @option {Boolean} [options] `multipart` default false
 *   @option {Object} [options] `formidable`
 * @return {GeneratorFunction}
 * @api public
 */
module.exports = function koaBetterBody(options) {
  options = extend(true, {}, defaults, options || {});

  return function * main(next) {
    if (this.request.body !== undefined || this.request.method === 'GET') {
      return yield * next;
    }

    var data = yield* handleRequest(this, options);

    this.request.body = options.patchKoa ? data : null;
    this.req.body = options.patchNode ? data : null;

    yield* next;
  };
};

/**
 * The magic. Checking and forming the request
 *
 * @param {Object} that
 * @param {Object} opts
 * @return {Object}
 * @api private
 */
function * handleRequest(that, opts) {
  var copy = {};
  var options = {
    encoding: opts.encoding,
    limit: opts.jsonLimit
  };

  if (that.request.is('application/json', 'application/csp-report')) {
    copy.fields = yield parse.json(that, options);
  } else if (that.request.is('application/x-www-form-urlencoded')) {
    options.limit = opts.formLimit;
    copy.fields = yield parse.form(that, options);
  } else if (that.request.is('multipart/form-data') && opts.multipart) {
    copy = yield formed(that, opts.formidable);
  }
  var files = copy.files;
  if (typeof opts.fieldsKey !== 'string') {
    copy = copy.fields;
  } else {
    var fields = copy.fields;
    copy = {};
    copy[opts.fieldsKey] = fields;
  }
  copy[opts.filesKey] = files;

  return copy;
}

/**
 * Promise-like parsing incoming form
 * and returning thunk
 *
 * @param  {Object} context
 * @param  {Object} options
 * @return {Function} thunk
 * @api private
 */
function formed(context, options) {
  return function(done) {
    var form = new formidable.IncomingForm(options);
    form.parse(context.req, function(err, fields, files) {
      if (err) {return done(err);}
      done(null, {fields: fields, files: files});
    });
  };
}
