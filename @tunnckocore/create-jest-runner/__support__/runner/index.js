const { createJestRunner } = require('../../');

module.exports = createJestRunner(require.resolve('./run'));
