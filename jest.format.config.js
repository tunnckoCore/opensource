// const utils = require('./@tunnckocore/utils/src');

// const { alias, exts } = utils.createAliases(__dirname, 'src');

module.exports = {
  displayName: 'lint',
  rootDir: __dirname,
  testMatch: ['<rootDir>/**/*'],
  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
    /.+.{js,jsx,ts,tsx,mjs}/.toString(),
    /CHANGELOG\.md/.toString(),
  ],
  // moduleNameMapper: alias,
  moduleFileExtensions: [
    'vue',
    'css',
    'less',
    'scss',
    'html',
    'json',
    'graphql',
    'md',
    'markdown',
    'mdx',
    'yaml',
    'yml',
  ],
  runner: 'jest-runner-prettier',
};
