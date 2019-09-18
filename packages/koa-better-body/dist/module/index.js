import { defaultOptions, setParsers, isValid, parseBody } from './utils';
export default function koaBetterBody(options) {
  const opts = defaultOptions(options);
  return function* plugin(next) {
    if (opts.strict && !isValid(this.method)) {
      return yield* next;
    }

    try {
      setParsers(this, opts);
      yield* parseBody(this, opts, next);
    } catch (err) {
      if (!opts.onError) throw err;
      opts.onError(err, this);
    }

    yield* next;
  };
}