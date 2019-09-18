function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { pass, fail, skip } from '@tunnckocore/create-jest-runner';
import { getWorkspacesAndExtensions } from '@tunnckocore/utils';
import cosmiconfig from 'cosmiconfig';
import { CLIEngine } from 'eslint';
const explorer = cosmiconfig('jest-runner');
export default async function jestRunnerESLint({
  testPath,
  config
}) {
  const start = Date.now();
  const options = normalizeOptions(explorer.searchSync(), config.rootDir);

  if (config.setupTestFrameworkScriptFile) {
    require(config.setupTestFrameworkScriptFile);
  }

  const engine = new CLIEngine(options.eslint);

  if (engine.isPathIgnored(testPath)) {
    return skip({
      start,
      end: Date.now(),
      test: {
        path: testPath,
        title: 'ESLint'
      }
    });
  }

  const report = engine.executeOnFiles([testPath]);

  if (options.eslint.fix && !options.fixDryRun) {
    CLIEngine.outputFixes(report);
  }

  const message = engine.getFormatter(options.reporter)(options.quiet ? CLIEngine.getErrorResults(report.results) : report.results);

  if (report.errorCount > 0) {
    return fail({
      start,
      end: Date.now(),
      test: {
        path: testPath,
        title: 'ESLint',
        errorMessage: message
      }
    });
  }

  const tooManyWarnings = options.maxWarnings >= 0 && report.warningCount > options.maxWarnings;

  if (tooManyWarnings) {
    return fail({
      start,
      end: Date.now(),
      test: {
        path: testPath,
        title: 'ESLint',
        errorMessage: `${message}\nESLint found too many warnings (maximum: ${options.maxWarnings}).`
      }
    });
  }

  const result = pass({
    start,
    end: Date.now(),
    test: {
      path: testPath,
      title: 'ESLint'
    }
  });

  if (!options.quiet && report.warningCount > 0) {
    result.console = [{
      message,
      origin: '',
      type: 'warn'
    }];
  }

  return result;
}

function normalizeOptions(val, rootDir) {
  const {
    extensions
  } = getWorkspacesAndExtensions(rootDir);
  const cfg = val && val.config ? val.config : {};

  const eslintOptions = _objectSpread({
    exit: true,
    warnings: false,
    maxWarnings: 10,
    reporter: 'codeframe',
    extensions,
    fix: true,
    reportUnusedDisableDirectives: true
  }, cfg.eslint, {
    cache: true
  });

  return _objectSpread({}, cfg, {
    eslint: eslintOptions
  });
}