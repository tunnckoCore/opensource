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

var cobody = require('co-body');
var forms = require('formidable');
var xtend = require('extend');

/**
 * ## Examples
 * > For a more comprehensive examples, see [examples](./examples) folder.
 *
 * - [`examples/multer`](./examples/multer.js) - usage like Express's bodyParser - [multer][multer-url] `npm run examples-multer`
 * - [`examples/koa-router`](./examples/koa-router.js) - usage with Alex's [koa-router][koa-router-url] `npm run examples-koa-router`
 *
 *
 * ## Options
 * > However, `koa-better-body` have few custom options, see also [co-body][cobody-url], [raw-body][rawbody-url], [formidable][formidable-url]
 * @param {Object} `options` custom control options
 *   @property {Boolean} [options] `patchNode` Patch request body to Node's `ctx.req` object, default `false`
 *   @property {Boolean} [options] `patchKoa` Patch request body to Koa's `ctx.request` object, default `true`
 *   @property {String|Number} [options] `jsonLimit` The byte limit of the JSON body, default `1mb`
 *   @property {String|Number} [options] `formLimit` The byte limit of the form body, default `56kb`
 *   @property {String} [options] `encoding` Sets encoding for incoming form fields, default `utf-8`
 *   @property {Boolean} [options] `multipart` Support `multipart/form-data` request bodies, default `false`
 *   @property {String|Boolean} [options] `fieldsKey` Name of the key for fields in the body object or `false`, default `'fields'`
 *   @property {Object} [options] `formidable` Options that are passing to `formidable`
 *   @property {Number} [options] `formidable.maxFields` See [formidable-options](./readme.md#formidable-options). our default `10`
 *   @property {Boolean} [options] `formidable.multiples` See [formidable-options](./readme.md#formidable-options), our default `true`
 *   @property {Boolean} [options] `formidable.keepExtensions` See [formidable-options](./readme.md#formidable-options), our default `true`
 * @return {GeneratorFunction} That you can use with [koa][koa-url] or [co][co-url]
 * @api public
 */
module.exports = function koabody(opts) {
  var defaultOptions = {
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
  opts = xtend(true, defaultOptions, opts || {});

  return function * koaBody(next) {
    if (this.request.method == 'GET') {
      this.request.body = this.body;
      return yield next;
    }
    var body = {};
    var json = null;
    var urlencoded = null;
    var multipart = null;

    if (this.request.is('application/json') || this.request.is('application/csp-report')) {
      json = yield cobody.json(this, {encoding: opts.encoding, limit: opts.jsonLimit});
    }
    else if (this.request.is('application/x-www-form-urlencoded')) {
      urlencoded = yield cobody.form(this, {encoding: opts.encoding, limit: opts.formLimit});
    }
    else if (this.request.is('multipart/form-data') && opts.multipart) {
      multipart = yield formy(this, opts.formidable);
    }
    else {
      return yield next;
    }

    if (opts.fieldsKey === false) {
      body = json || urlencoded || multipart.fields;
    }
    else if (typeof opts.fieldsKey === 'string' && opts.fieldsKey.length > 0) {
      body[opts.fieldsKey] = json || urlencoded || multipart.fields;
    }

    if (opts.patchNode) {
      this.req.body = body;
      finalCheck(this.req, multipart);
    }
    if (opts.patchKoa) {
      this.request.body = body;
      finalCheck(this.request, multipart);
    }

    yield next;
  };
};


/**
 * Doneable formidable
 *
 * @param  {Stream} `ctx`
 * @param  {Object} `opts`
 * @return {Function} Node-style callback, ready for yielding
 * @api private
 */
function formy(ctx, opts) {
  return function (done) {
    var form = new forms.IncomingForm(opts);
    form.parse(ctx.req, function (err, fields, files) {
      if (err) return done(err);
      done(null, {fields: fields, files: files});
    });
  };
}


/**
 * Basic check
 *
 * @param {Object} `ctx`
 * @param {Object} `multipart`
 * @api private
 */
function finalCheck(ctx, multipart) {
  if ('files' in ctx.body) {
    (multipart) ? ctx.files = multipart.files : 0;
  } else {
    (multipart) ? ctx.body.files = multipart.files : 0;
  }
}
