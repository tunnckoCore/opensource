const path = require('path');
const utils = require('@tunnckocore/utils');

module.exports = (options) => {
  const opts = { cwd: process.cwd(), ...options };
  const { exts, alias, workspaces } = utils.createAliases(opts.cwd);
  const ignores = []
    .concat(opts.ignores)
    .filter(Boolean)
    .map((x) => (typeof x === 'string' ? x : x.toString()));

  /* eslint-disable-next-line import/no-dynamic-require, global-require */
  const { meta: { build = [] } = {} } = require(path.join(
    opts.cwd,
    'package.json',
  ));

  const isMonorepo = workspaces.length > 0;

  const jestCfg = {
    rootDir: opts.cwd,
    displayName: 'build',
    testMatch: isMonorepo
      ? build.map((pkgName) => {
          const source = alias[pkgName];

          return `${source}/**/*.{${exts.join(',')}}`;
        })
      : [`<rootDir>/src/**/*.{${exts.join(',')}}`],
    testPathIgnorePatterns: [
      /node_modules/.toString(),
      /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
    ].concat(ignores),
    moduleFileExtensions: exts,
    runner: '@tunnckocore/jest-runner-babel',
  };

  if (isMonorepo) {
    jestCfg.moduleDirectories = ['node_modules'].concat(workspaces);
    jestCfg.moduleNameMapper = alias;
  }

  return jestCfg;
};
