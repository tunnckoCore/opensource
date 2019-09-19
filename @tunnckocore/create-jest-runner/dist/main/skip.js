"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toTestResult = _interopRequireDefault(require("./toTestResult"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const skip = ({
  start,
  end,
  test
}) => (0, _toTestResult.default)({
  stats: {
    failures: 0,
    pending: 1,
    passes: 0,
    todo: 0,
    start,
    end
  },
  skipped: true,
  tests: [{
    duration: end - start,
    ...test
  }],
  jestTestPath: test.path
});

var _default = skip;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;