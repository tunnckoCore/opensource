const createJestRunner = require('./createJestRunner');
const runnerWrapper = require('./runner-wrapper');
const pass = require('./pass');
const fail = require('./fail');
const skip = require('./skip');
const todo = require('./todo');

exports.default = {
  createJestRunner,
  pass,
  fail,
  skip,
  todo,
};

exports.runner = runnerWrapper;
exports.createJestRunner = createJestRunner;
exports.pass = pass;
exports.fail = fail;
exports.skip = skip;
exports.todo = todo;

// eslint-disable-next-line no-underscore-dangle
const ___exportsWithoutDefault = Object.keys(exports)
  .filter((x) => x !== 'default')
  .reduce((acc, key) => {
    acc[key] = exports[key];
    return acc;
  }, {});

module.exports = Object.assign(exports.default, ___exportsWithoutDefault);
