const path = require('path');
const utils = require('../@tunnckocore/utils/src');

const ROOT = path.dirname(__dirname);
const { exts, workspaces } = utils.createAliases(ROOT);

module.exports = {
  rootDir: ROOT,
  displayName: 'bundle',
  testMatch: workspaces.map((ws) => `<rootDir>/${ws}/*/src/**/*`),
  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
    /.+\/@tunnckocore\/utils\/.+/.toString(),
    /.+(?:-config|jest-runner|babel-preset).+/.toString(),
    /.+\/koa-better-body\/.+/.toString(),
  ],
  // moduleNameMapper: alias,
  moduleFileExtensions: exts,
  runner: path.join(ROOT, 'packages/jest-runner-rollup/src/index.js'),
};
