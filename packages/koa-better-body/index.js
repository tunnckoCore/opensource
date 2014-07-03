/*!
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 * 
 * Copyright (c) 2014 Charlike Mike Reagent, Daryl Lau, contributors.
 * Released under the MIT license.
 */

'use strict';

/*!
 * Module dependencies.
 */

var buddy = require('co-body');
var forms = require('formidable');
var xtend = require('extend');

var defaultOptions = {
  patchNode: false,
  patchKoa: true,
  multipart: false,
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
 * Doneable formidable
 * 
 * @param  {Stream} ctx
 * @param  {Object} opts
 * @return {Function} Node-style callback, ready for yielding
 * @api private
 */
function formy(ctx, opts) {
  return function(done) {
    var form = new forms.IncomingForm(opts);
    form.parse(ctx.req, function(err, fields, files) {
      if (err) {return done(err);}
      done(null, {fields: fields, files: files});
    });
  };
}

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
 * 
 * @param {Boolean} `patchNode` Patch request body to Node's `ctx.req` object, default `false`
 * @param {Boolean} `patchKoa` Patch request body to Koa's `ctx.request` object, default `true`
 * @param {String|Number} `jsonLimit` The byte limit of the JSON body, default `1mb`
 * @param {String|Number} `formLimit` The byte limit of the form body, default `56kb`
 * @param {String} `encoding` Sets encoding for incoming form fields, default `utf-8`
 * @param {Boolean} `multipart` Support `multipart/form-data` request bodies, default `false`
 * @param {Object} `formidable` Options that are passing to `formidable`
 * @param {Number} `formidable.maxFields` See [formidable-options](./readme.md#formidable-options). our default `10`
 * @param {Boolean} `formidable.multiples` See [formidable-options](./readme.md#formidable-options), our default `true`
 * @param {Boolean} `formidable.keepExtensions` See [formidable-options](./readme.md#formidable-options), our default `true`
 * @return {GeneratorFunction} That you can use with [koa][koa-url] or [co][co-url]
 * @api public
 */

module.exports = function koaBody(options) {
  var opts = xtend(true, defaultOptions, options || {});
  
  return function* koaBody(next){
    var body = {}, json, form;
    if (this.request.is('json'))  {
      json = yield buddy.json(this, {encoding: opts.encoding, limit: opts.jsonLimit});
      body.fields = json;
    }
    else if (this.request.is('urlencoded')) {
      form = yield buddy.form(this, {encoding: opts.encoding, limit: opts.formLimit});
      body.fields = form;
    }
    else if (this.request.is('multipart') && opts.multipart) {
      body = yield formy(this, opts.formidable);
    }

    if (opts.patchNode) {
      this.req.body = body;
    }
    if (opts.patchKoa) {
      this.request.body = body;
    }
    yield next;
  };
};
