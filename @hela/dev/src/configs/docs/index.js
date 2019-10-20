const utils = require('@tunnckocore/utils');

module.exports = (options) => {
  const opts = { cwd: process.cwd(), ...options };
  const { exts, alias } = utils.createAliases(opts.cwd);
  const ignores = []
    .concat(opts.ignores)
    .filter(Boolean)
    .map((x) => (typeof x === 'string' ? x : x.toString()));

  return {
    rootDir: opts.cwd,
    displayName: 'docs',
    testMatch: Object.values(alias)
      .map((source) => `${source}/index.{${exts.join(',')}}`)
      .filter((x) => {
        const ignored = ignores.find((name) => x.includes(name));

        return !ignored;
      }),
    testPathIgnorePatterns: [
      /node_modules/.toString(),
      /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
    ].concat(ignores),
    moduleFileExtensions: exts,
    runner: 'jest-runner-docs',
  };
};
