const path = require('path');
const utils = require('../@tunnckocore/utils/src');

const ROOT = path.dirname(__dirname);
const { workspaces } = utils.createAliases(ROOT, 'src');

module.exports = {
  rootDir: ROOT,
  displayName: 'test',
  testMatch: workspaces.map((ws) => `<rootDir>/${ws}/*/test/**/*`),
  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
  ],
  // moduleNameMapper: alias,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
};
