'use strict';

/**
 * Module dependencies.
 */

var extend = require('extend');
var parse = require('co-body');
var formidable = require('formidable');

/**
 * @param [Object] `opts`
 *   - {String} `jsonLimit` default '1mb'
 *   - {String} `formLimit` default '56kb'
 *   - {string} `encoding` default 'utf-8'
 */
module.exports = function (opts) {
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
  opts = extend(true, defaults, opts || {});

  return function * koaBetterBody(next) {
    if (this.request.method === 'GET') {
      this.request.body = this.body;
      return yield next;
    }
    if (this.request.body !== undefined) {
      return yield next;
    }
    var copy = {};

    if (this.request.is('application/json', 'application/csp-report')) {
      copy.fields = yield parse.json(this, {encoding: opts.encoding, limit: opts.jsonLimit});
      typeof opts.fieldsKey !== 'string'
      ? (this.request.body = copy.fields)
      : (this.request.body[opts.fieldsKey] = copy.fields)
      return yield next;
    }

    if (this.request.is('application/x-www-form-urlencoded')) {
      copy.fields = yield parse.form(this, {encoding: opts.encoding, limit: opts.formLimit});
      typeof opts.fieldsKey !== 'string'
      ? (this.request.body = copy.fields)
      : (this.request.body[opts.fieldsKey] = copy.fields)
      return yield next;
    }

    if (this.request.is('multipart/form-data') && opts.multipart) {
      copy = yield formed(this, opts.formidable);
      
      typeof opts.fieldsKey !== 'string'
      ? (this.request.body = copy.fields)
      : (this.request.body[opts.fieldsKey] = copy.fields)

      this.request.body.files = copy.files;
      return yield next;
    }
    yield next;
  };
};

function formed(context, options) {
  return function (done) {
    var form = new formidable.IncomingForm(options);
    form.parse(context.req, function (err, fields, files) {
      if (err) {return done(err);}
      done(null, {fields: fields, files: files});
    });
  };
}
