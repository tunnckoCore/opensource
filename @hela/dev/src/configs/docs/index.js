const utils = require('@tunnckocore/utils');

module.exports = (options) => {
  const opts = { cwd: process.cwd(), ...options };
  const { exts, alias, workspaces } = utils.createAliases(opts.cwd);
  const ignores = []
    .concat(opts.ignores)
    .filter(Boolean)
    .map((x) => (typeof x === 'string' ? x : x.toString()));

  const isMonorepo = workspaces.length > 0;

  const jestCfg = {
    rootDir: opts.cwd,
    displayName: 'docs',
    testMatch: isMonorepo
      ? Object.values(alias)
          .map((source) => `${source}/index.{${exts.join(',')}}`)
          .filter((x) => {
            const ignored = ignores.find((name) => x.includes(name));

            return !ignored;
          })
      : [`<rootDir>/src/index.{${exts.join(',')}}`],
    testPathIgnorePatterns: [
      /node_modules/.toString(),
      /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
    ].concat(ignores),
    moduleFileExtensions: exts,
    runner: 'jest-runner-docs',
  };

  if (isMonorepo) {
    jestCfg.moduleDirectories = ['node_modules'].concat(workspaces);
    jestCfg.moduleNameMapper = alias;
  }

  return jestCfg;
};
