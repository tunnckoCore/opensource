"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = koaBetterBody;

var _utils = require("./utils");

function koaBetterBody(options) {
  const opts = (0, _utils.defaultOptions)(options);
  return function* plugin(next) {
    if (opts.strict && !(0, _utils.isValid)(this.method)) {
      return yield* next;
    }

    try {
      (0, _utils.setParsers)(this, opts);
      yield* (0, _utils.parseBody)(this, opts, next);
    } catch (err) {
      if (!opts.onError) throw err;
      opts.onError(err, this);
    }

    yield* next;
  };
}

module.exports = exports.default;
module.exports.default = exports.default;