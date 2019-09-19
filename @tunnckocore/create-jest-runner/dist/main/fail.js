"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toTestResult = _interopRequireDefault(require("./toTestResult"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fail = ({
  start,
  end,
  test,
  errorMessage
}) => (0, _toTestResult.default)({
  errorMessage: errorMessage || test.errorMessage,
  stats: {
    failures: 1,
    pending: 0,
    passes: 0,
    todo: 0,
    start,
    end
  },
  tests: [{
    duration: end - start,
    ...test
  }],
  jestTestPath: test.path
});

var _default = fail;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;