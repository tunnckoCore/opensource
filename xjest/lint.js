const path = require('path');
const utils = require('../@tunnckocore/utils/src');

const ROOT = path.dirname(__dirname);
const { alias, exts } = utils.createAliases(ROOT);

module.exports = {
  rootDir: ROOT,
  displayName: 'lint',
  testMatch: Object.values(alias).map((source) => `${source}/**/*`),
  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
  ],
  moduleNameMapper: alias,
  moduleFileExtensions: exts,
  runner: path.join(ROOT, '@tunnckocore/jest-runner-eslint/src/index.js'),
};
