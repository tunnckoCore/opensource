const { createJestRunner } = require('@tunnckocore/create-jest-runner');

module.exports = createJestRunner(require.resolve('./runner'));
