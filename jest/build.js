const path = require('path');
const utils = require('../@tunnckocore/utils/src');

const ROOT = path.dirname(__dirname);
const { exts } = utils.getWorkspacesAndExtensions(ROOT);

module.exports = {
  rootDir: ROOT,
  displayName: 'build',
  testMatch: [
    '<rootDir>/packages/*/src/**/*',
    '<rootDir>/@tunnckocore/*/src/**/*',
  ],
  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
    /.+\/@tunnckocore\/utils\/.+/.toString(),
    /.+\/jest-runner-rollup\/.+/.toString(),
    /.+\/koa-better-body\/.+/.toString(),
  ],
  // moduleNameMapper: alias,
  moduleFileExtensions: exts,
  runner: path.join(ROOT, '@tunnckocore/jest-runner-babel/dist/main/index.js'),
};
