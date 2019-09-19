'use strict';

var path = require('path');
var createJestRunner = require('@tunnckocore/create-jest-runner');

var index = createJestRunner.createJestRunner(path.join(__dirname, 'runner.js'));

module.exports = index;
