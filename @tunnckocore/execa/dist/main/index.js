"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exec = exec;
exports.shell = shell;
exports.default = void 0;

var _execa = _interopRequireDefault(require("execa"));

var _pMap = _interopRequireDefault(require("p-map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function exec(cmds, options) {
  const commands = [].concat(cmds).filter(Boolean);
  const {
    concurrency = Infinity,
    ...opts
  } = {
    preferLocal: true,
    ...options
  };
  return (0, _pMap.default)(commands, cmd => _execa.default.command(cmd, opts), {
    concurrency
  });
}

function shell(cmds, options) {
  return exec(cmds, { ...options,
    shell: true
  });
}

var _default = _execa.default;
exports.default = _default;