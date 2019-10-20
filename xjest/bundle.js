const path = require('path');
const utils = require('../@tunnckocore/utils/src');

const ROOT = path.dirname(__dirname);
const { exts, alias } = utils.createAliases(ROOT);

const { meta } = require('../package.json');

module.exports = {
  rootDir: ROOT,
  displayName: 'bundle',
  // testMatch: ['<rootDir>/@tunnckocore/execa/src/index.js'],
  testMatch: meta.bundle.map((pkgName) => {
    const source = alias[pkgName];

    return `${source}/index.{${exts.join(',')}}`;
  }),
  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
  ],
  // moduleNameMapper: alias,
  moduleFileExtensions: exts,
  runner: path.join(ROOT, 'packages/jest-runner-rollup/src/index.js'),
};
