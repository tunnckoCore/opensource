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
  encoding: 'utf-8',
  jsonLimit: '1mb',
  formLimit: '56kb',
  formidable: {
    multiples: true,
    keepExtensions: true,
    maxFields: 10,
  }
};

/**
 * @param [Object] `opts`
 *   - {String} `jsonLimit` default '1mb'
 *   - {String} `formLimit` default '56kb'
 *   - {String} `encoding` default 'utf-8'
 *   - {String} `fieldsKey` default 'fields'
 *   - {Boolean} `patchNode` default false
 *   - {Boolean} `patchKoa` default true
 *   - {Boolean} `multipart` default false
 *   - {Object} `formidable`
 */
module.exports = function (opts) {
  opts = extend(true, defaults, opts || {});

  return function * main(next) {
    if (this.request.body !== undefined || this.request.method === 'GET') {
      return yield* next;
    }

    var data = yield* handleRequest(this, opts);

    this.request.body = data && opts.patchKoa;
    this.req.body = data && opts.patchNode;

    yield* next;
  };
};

function* handleRequest(that, opts) {
  var copy = {};
  if (that.request.is('application/json', 'application/csp-report')) {
    copy.fields = yield parse.json(that, {encoding: opts.encoding, limit: opts.jsonLimit});
  }
  else if (that.request.is('application/x-www-form-urlencoded')) {
    copy.fields = yield parse.form(that, {encoding: opts.encoding, limit: opts.formLimit});
  }
  else if (that.request.is('multipart/form-data') && opts.multipart) {
    copy = yield formed(that, opts.formidable);
  }
  if (typeof opts.fieldsKey !== 'string') {
    copy = copy.fields
  } else {
    var files = copy.files
    copy[opts.fieldsKey] = copy.fields;
    copy.files = files;
  }
  
  return copy;
}

function formed(context, options) {
  return function (done) {
    var form = new formidable.IncomingForm(options);
    form.parse(context.req, function (err, fields, files) {
      if (err) {return done(err);}
      done(null, {fields: fields, files: files});
    });
  };
}
