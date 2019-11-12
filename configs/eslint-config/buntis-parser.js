'use strict';

const buntis = require('buntis');

module.exports = {
  parse: (code, options = {}) => {
    const opts = {
      ts: true,
      jsx: true,
      next: true,
      scriptType: 'module',
      ...options,
    };

    if (opts.scriptType === 'module') {
      return opts.ts
        ? buntis.parseTSModule(code, opts)
        : buntis.parseModule(code, opts);
    }

    return opts.ts
      ? buntis.parseTSScript(code, opts)
      : buntis.parseScript(code, opts);
  },
};
