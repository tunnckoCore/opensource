const path = require('path');
const utils = require('../@tunnckocore/utils/src');

const ROOT = path.dirname(__dirname);
const { exts, alias } = utils.createAliases(ROOT);

const { meta } = require('../package.json');

module.exports = {
  rootDir: ROOT,
  displayName: 'build',
  testMatch: meta.build.map((pkgName) => {
    const source = alias[pkgName];

    return `${source}/**/*.{${exts.join(',')}}`;
  }),
  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
  ],
  // moduleNameMapper: alias,
  moduleFileExtensions: exts,
  runner: path.join(ROOT, '@tunnckocore/jest-runner-babel/src/index.js'),
};
