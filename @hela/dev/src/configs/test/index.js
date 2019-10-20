const utils = require('@tunnckocore/utils');

module.exports = (options) => {
  const opts = { cwd: process.cwd(), ...options };
  const { exts, workspaces } = utils.createAliases(opts.cwd);
  const ignores = []
    .concat(opts.ignores)
    .filter(Boolean)
    .map((x) => (typeof x === 'string' ? x : x.toString()));

  return {
    rootDir: opts.cwd,
    displayName: 'test',
    testMatch: workspaces
      .map((ws) => `<rootDir>/${ws}/*/test/**/*.{${exts.join(',')}}`)
      .concat(ignores),
    testPathIgnorePatterns: [
      /node_modules/.toString(),
      /(?:__)?(?:fixtures?|supports?|shared|snapshots)(?:__)?/.toString(),
    ],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  };
};
