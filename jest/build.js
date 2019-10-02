const path = require('path');
const utils = require('../@tunnckocore/utils/src');

const ROOT = path.dirname(__dirname);
const { exts, workspaces } = utils.createAliases(ROOT);

module.exports = {
  rootDir: ROOT,
  displayName: 'build',
  testMatch: workspaces.map((ws) => `<rootDir>/${ws}/*/src/**/*`),
  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
    /.+\/@tunnckocore\/utils\/.+/.toString(),
    /.+(?:-config|jest-runner|babel-preset).+/.toString(),
  ],
  // moduleNameMapper: alias,
  moduleFileExtensions: exts,
  runner: path.join(ROOT, '@tunnckocore/jest-runner-babel/src/index.js'),
};
