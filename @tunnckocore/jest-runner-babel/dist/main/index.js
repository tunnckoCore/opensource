"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createJestRunner = require("@tunnckocore/create-jest-runner");

var _default = (0, _createJestRunner.createJestRunner)(require.resolve('./runner'));

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;