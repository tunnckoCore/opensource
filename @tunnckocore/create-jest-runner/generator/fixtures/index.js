// eslint-disable-next-line import/no-extraneous-dependencies
const { createJestRunner } = require('@tunnckocore/create-jest-runner');

module.exports = createJestRunner(require.resolve('./run'));
