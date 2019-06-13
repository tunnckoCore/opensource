'use strict';

module.exports = {
  statements: 0,
  branches: 0,
  functions: 0,
  lines: 0,
  cache: true,
  'check-coverage': true,
  require: 'esm',
  reporter: ['lcov', 'text'],
  include: ['src/**/*.js'],
};
