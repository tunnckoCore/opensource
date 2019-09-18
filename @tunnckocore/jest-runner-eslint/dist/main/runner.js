"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = jestRunnerESLint;

var _createJestRunner = require("@tunnckocore/create-jest-runner");

var _utils = require("@tunnckocore/utils");

var _cosmiconfig = _interopRequireDefault(require("cosmiconfig"));

var _eslint = require("eslint");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const explorer = (0, _cosmiconfig.default)('jest-runner');

async function jestRunnerESLint({
  testPath,
  config
}) {
  const start = Date.now();
  const options = normalizeOptions(explorer.searchSync(), config.rootDir);

  if (config.setupTestFrameworkScriptFile) {
    require(config.setupTestFrameworkScriptFile);
  }

  const engine = new _eslint.CLIEngine(options.eslint);

  if (engine.isPathIgnored(testPath)) {
    return (0, _createJestRunner.skip)({
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
    _eslint.CLIEngine.outputFixes(report);
  }

  const message = engine.getFormatter(options.reporter)(options.quiet ? _eslint.CLIEngine.getErrorResults(report.results) : report.results);

  if (report.errorCount > 0) {
    return (0, _createJestRunner.fail)({
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
    return (0, _createJestRunner.fail)({
      start,
      end: Date.now(),
      test: {
        path: testPath,
        title: 'ESLint',
        errorMessage: `${message}\nESLint found too many warnings (maximum: ${options.maxWarnings}).`
      }
    });
  }

  const result = (0, _createJestRunner.pass)({
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
  } = (0, _utils.getWorkspacesAndExtensions)(rootDir);
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

module.exports = exports.default;
module.exports.default = exports.default;