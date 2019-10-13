const path = require('path');
const utils = require('../@tunnckocore/utils/src');

const ROOT = path.dirname(__dirname);
const { exts, workspaces } = utils.createAliases(ROOT);

module.exports = {
  rootDir: ROOT,
  displayName: 'bundle',
  // testMatch: ['<rootDir>/@tunnckocore/execa/src/index.js'],
  testMatch: workspaces
    .map(
      (ws) => `<rootDir>/${ws}/!(jest-runner-*)/src/index.{${exts.join(',')}}`,
    )
    .concat([
      `<rootDir>/@tunnckocore/jest-runner-*/src/runner.js`,
      `<rootDir>/packages/jest-runner-*/src/runner.js`,
    ]),
  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
    /.+\/@tunnckocore\/utils\/.+/.toString(),
    /.+(?:-config|babel-preset).+/.toString(),
    /.+\/koa-better-body\/.+/.toString(),
  ],
  // moduleNameMapper: alias,
  moduleFileExtensions: exts,
  runner: path.join(ROOT, 'packages/jest-runner-rollup/src/index.js'),
};
