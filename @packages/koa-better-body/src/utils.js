import extend from 'extend-shallow';
import formidable from 'formidable';
import querystring from 'node:querystring';
import bodyParsers from 'koa-body-parsers';

/**
 * > Default options that will be loaded. Pass `options` to overwrite them.
 *
 * @param  {Object} `options`
 * @return {Object}
 * @api private
 */
export function defaultOptions(options = {}) {
  const cfg = { ...options };

  const types = defaultTypes(cfg.extendTypes);
  const opts = extend(
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
      decodeURIComponent: querystring.unescape,
      maxKeys: 1000,
    },
    cfg,
  );

  opts.delimiter = opts.sep || opts.delimiter;
  opts.formLimit = opts.formLimit || opts.urlencodedLimit;
  opts.extendTypes = types;
  opts.onError = opts.onЕrror || opts.onerror;
  opts.onError = typeof opts.onError === 'function' ? opts.onError : false;

  opts.delimiter = typeof opts.delimiter === 'string' ? opts.delimiter : '&';

  if (typeof opts.handler !== 'function') {
    // eslint-disable-next-line no-empty-function
    opts.handler = function* noopHandler() {};
  }
  if (typeof opts.detectJSON !== 'function') {
    opts.detectJSON = function detectJSON() {
      return false;
    };
  }

  return opts;
}

/**
 * > Only extend/overwrite default accept types.
 *
 * @param  {Object} `types`
 * @return {Object}
 * @api private
 */
export function defaultTypes(types = {}) {
  const allTypes = { ...types };

  return extend(
    {
      multipart: ['multipart/form-data'],
      text: ['text/*'],
      form: ['application/x-www-form-urlencoded'],
      json: [
        'application/json',
        'application/json-patch+json',
        'application/vnd.api+json',
        'application/csp-report',
      ],
      buffer: ['text/*'],
    },
    allTypes,
  );
}

/**
 * > Is "valid" request method, according to IETF Draft.
 *
 * @see   https://tools.ietf.org/html/draft-ietf-httpbis-p2-semantics-19#section-6.1
 * @param  {String} `method` koa request method
 * @return {Boolean}
 * @api private
 */
export function isValid(method) {
  return !['GET', 'HEAD', 'DELETE'].includes(method.toUpperCase());
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
export function setParsers(ctx, opts) {
  ctx.app.querystring =
    opts.querystring ||
    opts.qs || // alias
    (ctx.app && ctx.app.querystring) ||
    (ctx.app && ctx.app.qs) || // alias
    ctx.qs; // alias

  bodyParsers(ctx);

  // to do: when using koa-body-parsers v3.1 - it adds support for this and
  // probably will break us in some way.
  // delete ctx.request.body;

  ctx.request.multipart = multipart.bind(ctx);
  return ctx;
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
export function multipart(opts) {
  const ctx = this;

  return function thunk(done) {
    const fields = {};
    const fileFields = {};
    const files = [];
    const form =
      opts.IncomingForm instanceof formidable.IncomingForm
        ? opts.IncomingForm
        : new formidable.IncomingForm(opts);

    form.on('error', done);
    form.on('aborted', done);
    form.on('file', (name, file) => {
      files.push(file);
      fileFields[name] = fileFields[name] || [];
      fileFields[name].push(file);
    });
    form.on('field', (name, field) => {
      // eslint-disable-next-line no-prototype-builtins
      if (fields.hasOwnProperty(name)) {
        if (Array.isArray(fields[name])) {
          fields[name].push(field);
        } else {
          fields[name] = [fields[name], field];
        }
      } else {
        fields[name] = field;
      }
    });
    form.on('end', () => {
      done(null, {
        fields: { ...fields, ...fileFields },
        files,
      });
    });
    form.parse(ctx.req);
  };
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

// eslint-disable-next-line max-statements, consistent-return
export function* parseBody(ctx, options, next) {
  const fields = typeof options.fields === 'string' ? options.fields : 'fields';
  const files = typeof options.files === 'string' ? options.files : 'files';
  const { custom } = options.extendTypes;

  if (custom && custom.length > 0 && ctx.request.is(custom)) {
    yield* options.handler.call(ctx, ctx, options, next);
    return yield* next;
  }
  if (options.detectJSON(ctx) || ctx.request.is(options.extendTypes.json)) {
    ctx.app.jsonStrict =
      typeof options.jsonStrict === 'boolean' ? options.jsonStrict : true;
    ctx.request[fields] = yield ctx.request.json(options.jsonLimit);
    return yield* next;
  }
  if (
    ctx.request.is(options.extendTypes.form || options.extendTypes.urlencoded)
  ) {
    const res = yield ctx.request.urlencoded(options.formLimit);
    ctx.request[fields] = res;
    return yield* next;
  }
  if (options.buffer && ctx.request.is(options.extendTypes.buffer)) {
    ctx.request.body = yield ctx.request.buffer(options.bufferLimit);
    return yield* next;
  }
  if (ctx.request.is(options.extendTypes.text)) {
    const limit = options.textLimit;
    const body = yield ctx.request.text(limit);

    ctx.request.body = body;
    return yield* next;
  }
  if (options.multipart && ctx.request.is(options.extendTypes.multipart)) {
    const result = yield ctx.request.multipart(options);
    ctx.request[fields] = result.fields;
    ctx.request[files] = result.files;
    return yield* next;
  }
}
