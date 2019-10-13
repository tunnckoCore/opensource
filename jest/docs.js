const path = require('path');
const utils = require('../@tunnckocore/utils/src');

const ROOT = path.dirname(__dirname);
const { exts, alias } = utils.createAliases(ROOT);

const docsIgnore = ['renovate-config', 'typescript-config'];

const testMatches = Object.values(alias)
  .map((source) => `${source}/index.{${exts.join(',')}}`)
  .filter((x) => !docsIgnore.includes(x));
console.log(testMatches);

module.exports = {
  rootDir: ROOT,
  displayName: 'docs',
  testMatch: testMatches,

  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
  ],
  // moduleNameMapper: alias,
  moduleFileExtensions: exts,
  runner: path.join(ROOT, 'packages/jest-runner-docs/src/index.js'),
};
