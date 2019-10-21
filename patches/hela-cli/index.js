'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = main;

let _path = _interopRequireDefault(require('path'));

let _process = _interopRequireDefault(require('process'));

let _cosmiconfig = _interopRequireDefault(require('cosmiconfig'));

let _esm = _interopRequireDefault(require('esm'));

let _core = require('@hela/core');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const esmRequire = (0, _esm.default)(module);
const explorer = (0, _cosmiconfig.default)('hela', {
  searchPlaces: [
    '.helarc.js',
    'hela.config.js',
    'package.json',
    '.helarc.json',
    '.helarc.yaml',
    '.helarc.yml',
    '.helarc',
  ],
  loaders: {
    '.js': esmRequire,
  },
});
const program = (0, _core.hela)();
program.command('help', 'Displays this message').action(() => {
  program.help();
});
program.option(
  '--show-stack',
  'Show error stack trace when command fail',
  false,
);

async function main() {
  const res = await explorer.search();

  if (!res || (res && !res.config)) {
    throw new Error('hela: no config found');
  }

  const config = res.filepath.endsWith('package.json')
    ? fromJson(res)
    : fromJS(res);
  console.log('hela: Loading config ->', res.filepath);

  const tasksKeys = Object.keys(config);
  tasksKeys
    .filter((x) => x !== 'cwd')
    .forEach((name, idx) => {
      const taskValue = config[name];

      if (taskValue && taskValue.isHela) {
        program.tree[name] = taskValue.tree[name];
      }
      if (idx === tasksKeys.length - 1) {
        const instance = config[name]

        program.commandAliases = instance.commandAliases
      }
    });
  return program.listen();
}

function fromJson({ config }) {
  if (typeof config === 'string') {
    if (config.length === 0) {
      throw new Error('hela: field can only be object or non-empty string');
    }

    return esmRequire(_path.default.join(_process.default.cwd(), config));
  }

  if (config && typeof config === 'object') {
    if (config.cwd) {
      if (!config.extends) {
        throw new Error(
          'hela: when defining `cwd` option, you need to pas `extends` too',
        );
      }

      return esmRequire(_path.default.join(config.cwd, config.extends));
    }

    return esmRequire(config.extends);
  }

  throw new Error('hela: config can only be object or string');
}

function fromJS({ config }) {
  if (config.default) {
    console.log(
      'hela warn: will use the default export for the preset loading mechanism',
    );
    return fromJson({
      config: config.default,
    });
  }

  return fromJson({ config });
}
