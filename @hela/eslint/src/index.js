'use strict';

const path = require('path');
const arrayify = require('arrify');
// const memoizeFs = require('memoize-fs');
const { CLIEngine } = require('eslint');

// const memoizer = memoizeFs({
//   cachePath: path.join(process.cwd(), '.cache', 'eslint-memoize'),
// });
// const memoize = memoizer.fn;

const DEFAULT_IGNORE = [
  '**/node_modules/**',
  '**/bower_components/**',
  'flow-typed/**',
  'coverage/**',
  '{tmp,temp}/**',
  '**/*.min.js',
  '**/bundle.js',
  'vendor/**',
  'dist/**',
];

const DEFAULT_INPUTS = ['src', 'test'];
const DEFAULT_EXTENSIONS = ['js', 'jsx', 'mjs', 'ts', 'tsx'];
const DEFAULT_OPTIONS = {
  exit: true,
  warnings: false,
  // reporter: 'codeframe',
  input: DEFAULT_INPUTS,
  ignore: DEFAULT_IGNORE,
  extensions: DEFAULT_EXTENSIONS,
  reportUnusedDisableDirectives: true,
};

function normalizeOptions(options) {
  const forcedOptions = {
    fix: true,
    cache: true,
    cacheLocation: path.join(process.cwd(), '.cache/eslintcache-file'),
  };
  const opts = { ...DEFAULT_OPTIONS, ...options, ...forcedOptions };

  opts.input = arrayify(opts.input);
  opts.ignore = DEFAULT_IGNORE.concat(arrayify(opts.ignore));
  opts.extensions = arrayify(opts.extensions);

  return opts;
}

function lint(name) {
  return async (value, fp, options) => {
    if (name === 'files') {
      // eslint-disable-next-line no-param-reassign
      options = fp;
    }
    const opts = normalizeOptions(options);

    const engine = new CLIEngine(opts);
    const fn = name === 'files' ? engine.executeOnFiles : engine.executeOnText;
    const report = fn.apply(
      engine,
      [value, name === 'text' && fp].filter(Boolean),
    );
    // const report = engine.executeOnText(value, 'foo.js');
    report.format = engine.getFormatter(opts.reporter);

    if (name === 'files') {
      CLIEngine.outputFixes(report);
    }
    return report;
  };
}

async function lintText(code, fp, options) {
  return lint('text')(code, fp, options);
}

async function lintFiles(patterns, options) {
  return lint('files')(patterns, options);
}

exports.normalizeOptions = normalizeOptions;
exports.lint = lint;
exports.lintText = lintText;
exports.lintFiles = lintFiles;
exports.DEFAULT_IGNORE = DEFAULT_IGNORE;
exports.DEFAULT_INPUTS = DEFAULT_INPUTS;
exports.DEFAULT_INPUT = DEFAULT_INPUTS;
