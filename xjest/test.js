const path = require('path');
const utils = require('../@tunnckocore/utils/src');

const ROOT = path.dirname(__dirname);
const { workspaces } = utils.createAliases(ROOT);

const exts = ['js', 'jsx', 'ts', 'tsx'];

module.exports = {
  rootDir: ROOT,
  displayName: 'test',
  testMatch: workspaces.map(
    (ws) => `<rootDir>/${ws}/*/test/**/*.{${exts.join(',')}}`,
  ),
  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /(?:__)?(?:fixtures?|supports?|shared|snapshots)(?:__)?/.toString(),
  ],
  moduleFileExtensions: exts,
};
