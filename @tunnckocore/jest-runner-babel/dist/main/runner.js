"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = jetRunnerBabel;

var _os = _interopRequireDefault(require("os"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _createJestRunner = require("@tunnckocore/create-jest-runner");

var _core = require("@babel/core");

var _cosmiconfig = _interopRequireDefault(require("cosmiconfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const explorer = (0, _cosmiconfig.default)('jest-runner');
const isWin32 = _os.default.platform() === 'win32';

async function jetRunnerBabel({
  testPath,
  config
}) {
  const start = new Date();
  let options = normalizeRunnerConfig(explorer.searchSync());
  const cfgs = [].concat(options.babel).filter(Boolean);
  const testResults = await Promise.all(cfgs.map((_ref) => {
    let {
      config: cfg
    } = _ref,
        opts = _objectWithoutProperties(_ref, ["config"]);

    options = _objectSpread({}, options, {}, opts);
    let result = null;

    try {
      result = (0, _core.transformFileSync)(testPath, cfg);
    } catch (err) {
      return (0, _createJestRunner.fail)({
        start,
        end: new Date(),
        test: {
          path: testPath,
          title: 'Babel',
          errorMessage: err.message
        }
      });
    }

    if (!result) {
      return (0, _createJestRunner.fail)({
        start,
        end: new Date(),
        test: {
          path: testPath,
          title: 'Babel',
          errorMessage: `Babel runner fails...`
        }
      });
    }

    let relativeTestPath = _path.default.relative(config.rootDir, testPath);

    if (isWin32 && !relativeTestPath.includes('/')) {
      relativeTestPath = relativeTestPath.replace(/\\/g, '/');
    }

    const outs = relativeTestPath.split('/').reduce((acc, item, idx) => {
      if (options.isMonorepo(config.cwd) && idx < 2) {
        return _objectSpread({}, acc, {
          dir: acc.dir.concat(item)
        });
      }

      return _objectSpread({}, acc, {
        file: acc.file.concat(item === options.srcDir ? null : item).filter(Boolean)
      });
    }, {
      file: [],
      dir: []
    });

    let outFile = _path.default.join(config.rootDir, ...outs.dir.filter(Boolean), options.outDir, ...outs.file.filter(Boolean));

    const outDir = _path.default.dirname(outFile);

    outFile = _path.default.join(outDir, `${_path.default.basename(outFile, _path.default.extname(outFile))}.js`);

    _fs.default.mkdirSync(outDir, {
      recursive: true
    });

    _fs.default.writeFileSync(outFile, result.code);

    return (0, _createJestRunner.pass)({
      start,
      end: new Date(),
      test: {
        path: outFile,
        title: 'Babel'
      }
    });
  }));
  return testResults;
}

function normalizeRunnerConfig(val) {
  const cfg = val && val.config ? val.config : {};

  const runnerConfig = _objectSpread({
    monorepo: false,
    outDir: 'dist',
    srcDir: 'src'
  }, cfg);

  runnerConfig.outDir = runnerConfig.outDir || runnerConfig.outdir;

  if (typeof runnerConfig.outDir !== 'string') {
    runnerConfig.outDir = 'dist';
  }

  if (typeof runnerConfig.srcDir !== 'string') {
    runnerConfig.srcDir = 'src';
  }

  runnerConfig.isMonorepo = typeof runnerConfig.isMonorepo === 'function' ? runnerConfig.isMonorepo : () => runnerConfig.monorepo;
  return runnerConfig;
}

module.exports = exports.default;
module.exports.default = exports.default;