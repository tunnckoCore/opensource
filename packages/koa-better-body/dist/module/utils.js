import extend from 'extend-shallow';
import formidable from 'formidable';
import querystring from 'querystring';
import bodyParsers from 'koa-body-parsers';
export function defaultOptions(options = {}) {
  const cfg = { ...options
  };
  const types = defaultTypes(cfg.extendTypes);
  const opts = extend({
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
    delimiter: '&',
    decodeURIComponent: querystring.unescape,
    maxKeys: 1000
  }, cfg);
  opts.delimiter = opts.sep || opts.delimiter;
  opts.formLimit = opts.formLimit || opts.urlencodedLimit;
  opts.extendTypes = types;
  opts.onError = opts.onЕrror || opts.onerror;
  opts.onError = typeof opts.onError === 'function' ? opts.onError : false;
  opts.delimiter = typeof opts.delimiter === 'string' ? opts.delimiter : '&';

  if (typeof opts.handler !== 'function') {
    opts.handler = function* noopHandler() {};
  }

  if (typeof opts.detectJSON !== 'function') {
    opts.detectJSON = function detectJSON() {
      return false;
    };
  }

  return opts;
}
export function defaultTypes(types = {}) {
  const allTypes = { ...types
  };
  return extend({
    multipart: ['multipart/form-data'],
    text: ['text/*'],
    form: ['application/x-www-form-urlencoded'],
    json: ['application/json', 'application/json-patch+json', 'application/vnd.api+json', 'application/csp-report'],
    buffer: ['text/*']
  }, allTypes);
}
export function isValid(method) {
  return !['GET', 'HEAD', 'DELETE'].includes(method.toUpperCase());
}
export function setParsers(ctx, opts) {
  ctx.app.querystring = opts.querystring || opts.qs || ctx.app && ctx.app.querystring || ctx.app && ctx.app.qs || ctx.qs;
  bodyParsers(ctx);
  ctx.request.multipart = multipart.bind(ctx);
  return ctx;
}
export function multipart(opts) {
  const ctx = this;
  return function thunk(done) {
    const fields = {};
    const fileFields = {};
    const files = [];
    const form = opts.IncomingForm instanceof formidable.IncomingForm ? opts.IncomingForm : new formidable.IncomingForm(opts);
    form.on('error', done);
    form.on('aborted', done);
    form.on('file', (name, file) => {
      files.push(file);
      fileFields[name] = fileFields[name] || [];
      fileFields[name].push(file);
    });
    form.on('field', (name, field) => {
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
        fields: { ...fields,
          ...fileFields
        },
        files
      });
    });
    form.parse(ctx.req);
  };
}
export function* parseBody(ctx, options, next) {
  const fields = typeof options.fields === 'string' ? options.fields : 'fields';
  const files = typeof options.files === 'string' ? options.files : 'files';
  const {
    custom
  } = options.extendTypes;

  if (custom && custom.length > 0 && ctx.request.is(custom)) {
    yield* options.handler.call(ctx, ctx, options, next);
    return yield* next;
  }

  if (options.detectJSON(ctx) || ctx.request.is(options.extendTypes.json)) {
    ctx.app.jsonStrict = typeof options.jsonStrict === 'boolean' ? options.jsonStrict : true;
    ctx.request[fields] = yield ctx.request.json(options.jsonLimit);
    return yield* next;
  }

  if (ctx.request.is(options.extendTypes.form || options.extendTypes.urlencoded)) {
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