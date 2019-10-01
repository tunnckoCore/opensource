const { join } = require('path');
const { createJestRunner } = require('@tunnckocore/create-jest-runner');

module.exports = createJestRunner(join(__dirname, 'runner.js'));
