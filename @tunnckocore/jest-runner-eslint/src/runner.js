const Module = require('module');

const { pass, fail, skip } = require('create-jest-runner');

const cosmiconfig = require('cosmiconfig');
const { CLIEngine } = require('eslint');

const explorer = cosmiconfig('jest-runner');

module.exports = async ({ testPath, config }) => {
  const start = Date.now();
  const options = normalizeOptions(explorer.searchSync());

  if (config.setupTestFrameworkScriptFile) {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    require(config.setupTestFrameworkScriptFile);
  }

  const engine = new CLIEngine(options.eslint);

  if (engine.isPathIgnored(testPath)) {
    return skip({
      start,
      end: Date.now(),
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

  const message = engine.getFormatter(options.reporter)(
    options.quiet ? CLIEngine.getErrorResults(report.results) : report.results,
  );

  if (report.errorCount > 0) {
    return fail({
      start,
      end: Date.now(),
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
      end: Date.now(),
      test: {
        path: testPath,
        title: 'ESLint',
        errorMessage: `${message}\nESLint found too many warnings (maximum: ${options.maxWarnings}).`,
      },
    });
  }

  const result = pass({
    start,
    end: Date.now(),
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
