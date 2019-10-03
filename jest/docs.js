const path = require('path');
const utils = require('../@tunnckocore/utils/src');

const ROOT = path.dirname(__dirname);
const { exts, workspaces } = utils.createAliases(ROOT);

module.exports = {
  rootDir: ROOT,
  displayName: 'docs',
  testMatch: workspaces.map((ws) => `<rootDir>/${ws}/*/src/index.js`),
  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
    /.+(?:-config|babel-preset).+/.toString(),
  ],
  // moduleNameMapper: alias,
  moduleFileExtensions: exts,
  runner: path.join(ROOT, 'packages/jest-runner-docs/src/index.js'),
};
