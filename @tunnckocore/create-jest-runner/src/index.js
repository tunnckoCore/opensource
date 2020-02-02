const createJestRunner = require('./createJestRunner');
const { wrapper, tryCatch, tryLoadConfig, createFailed } = require('./utils');
const pass = require('./pass');
const fail = require('./fail');
const skip = require('./skip');
const todo = require('./todo');

exports.default = {
  createJestRunner,
  createRunner: createJestRunner,
  defineJestRunner: wrapper,
  defineRunner: wrapper,
  runner: wrapper,
  wrapper,
  utils: {
    tryCatch,
    tryLoadConfig,
    createFailed,
  },
  pass,
  fail,
  skip,
  todo,
};

// eslint-disable-next-line no-underscore-dangle
const ___exportsWithoutDefault = Object.keys(exports.default)
  .map((k) => {
    exports[k] = exports.default[k];
    return k;
  })
  .filter((x) => x !== 'default')
  .reduce((acc, key) => {
    acc[key] = exports[key];
    return acc;
  }, {});

module.exports = Object.assign(exports.default, ___exportsWithoutDefault);
