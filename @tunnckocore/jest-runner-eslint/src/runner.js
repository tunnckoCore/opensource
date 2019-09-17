// const os = require('os');
// const path = require('path');
const Module = require('module');

const { pass, fail, skip } = require('create-jest-runner');

// const utils = require('@tunnckocore/utils');
const cosmiconfig = require('cosmiconfig');
const { CLIEngine } = require('eslint');

// const DEFAULT_IGNORE = [
//   '**/node_modules/**',
//   '**/bower_components/**',
//   'flow-typed/**',
//   'coverage/**',
//   '{tmp,temp}/**',
//   '**/*.min.js',
//   '**/bundle.js',
//   'vendor/**',
//   'dist/**',
// ];

// const DEFAULT_EXTENSIONS = ['js', 'jsx', 'mjs', 'ts', 'tsx'];

const explorer = cosmiconfig('jest-runner');

// function normalizeOptions(options) {
//   const result = explorer.searchSync(options.rootDir);
//   const opts = Object.assign(
//     {
//       exit: true,
//       warnings: false,
//       reporter: 'codeframe',
//       input: DEFAULT_INPUTS,
//       ignore: DEFAULT_IGNORE,
//       extensions: DEFAULT_EXTENSIONS,
//     },
//     options,
//     result && result.config,
//     {
//       fix: true,
//       cache: true,
//       cacheLocation: path.join(os.homedir() || os.tmpdir(), '.xaxa-cache'),
//       reportUnusedDisableDirectives: true,
//       useEslintrc: false,
//       baseConfig: {
//         extends: ['@tunnckocore'],
//       },
//     },
//   );

//   const flat = (...args) => [].concat(...args).filter(Boolean);
//   opts.input = flat(opts.input);
//   opts.ignore = DEFAULT_IGNORE.concat(flat(opts.ignore));
//   opts.extensions = flat(opts.extensions);

//   return opts;
// }

module.exports = async ({ testPath }) => {
  const start = Date.now();
  const options = normalizeOptions(explorer.searchSync());

  // if (config.setupTestFrameworkScriptFile) {
  //   // eslint-disable-next-line import/no-dynamic-require,global-require
  //   require(config.setupTestFrameworkScriptFile);
  // }
  // const opts = normalizeOptions({ ...extraOptions, rootDir: config.rootDir });

  const engine = new CLIEngine(options.eslint);

  if (engine.isPathIgnored(testPath)) {
    const end = Date.now();
    return skip({
      start,
      end,
      test: {
        path: testPath,
        title: 'ESLint',
      },
    });
  }

  const report = engine.executeOnFiles([testPath]);

  if (options.eslint.fix && !options.fixDryRun) {
    CLIEngine.outputFixes(report);
  }

  const end = Date.now();
  const message = engine.getFormatter(options.reporter)(
    options.quiet ? CLIEngine.getErrorResults(report.results) : report.results,
  );

  if (report.errorCount > 0) {
    return fail({
      start,
      end,
      test: {
        path: testPath,
        title: 'ESLint',
        errorMessage: message,
      },
    });
  }

  const tooManyWarnings =
    options.maxWarnings >= 0 && report.warningCount > options.maxWarnings;

  if (tooManyWarnings) {
    return fail({
      start,
      end,
      test: {
        path: testPath,
        title: 'ESLint',
        errorMessage: `${message}\nESLint found too many warnings (maximum: ${options.maxWarnings}).`,
      },
    });
  }

  const result = pass({
    start,
    end,
    test: {
      path: testPath,
      title: 'ESLint',
    },
  });

  if (!options.quiet && report.warningCount > 0) {
    result.console = [
      {
        message,
        origin: '',
        type: 'warn',
      },
    ];
  }

  return result;
};

function normalizeOptions(val) {
  const cfg = val && val.config ? val.config : {};
  const eslintOptions = {
    // ignore: DEFAULT_IGNORE,
    exit: true,
    warnings: false,
    maxWarnings: 10,
    reporter: 'codeframe',
    // eslint-disable-next-line no-underscore-dangle
    extensions: Object.keys(Module._extensions),
    fix: true,
    reportUnusedDisableDirectives: true,
    ...cfg.eslint,
    cache: true,
    // useEslintrc: false,
    // baseConfig: {
    //   extends: ['@tunnckocore'],
    // },
  };

  return {
    ...cfg,
    eslint: eslintOptions,
  };
}
