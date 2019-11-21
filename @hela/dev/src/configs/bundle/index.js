import path from 'path';
import utils from '@tunnckocore/utils';

export default (options) => {
  const opts = { cwd: process.cwd(), ...options };
  const { exts, alias, workspaces } = utils.createAliases(opts.cwd);
  const ignores = []
    .concat(opts.ignores)
    .filter(Boolean)
    .map((x) => (typeof x === 'string' ? x : x.toString()));

  /* eslint-disable-next-line import/no-dynamic-require, global-require */
  const { meta: { bundle = [] } = {} } = require(path.join(
    opts.cwd,
    'package.json',
  ));

  const isMonorepo = workspaces.length > 0;

  const jestCfg = {
    rootDir: opts.cwd,
    displayName: 'bundle',
    testMatch: isMonorepo
      ? bundle.map((pkgName) => {
          const source = alias[pkgName];

          return `${source}/index.{${exts.join(',')}}`;
        })
      : [`<rootDir>/src/index.{${exts.join(',')}}`],
    testPathIgnorePatterns: [
      /node_modules/.toString(),
      /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
    ].concat(ignores),
    moduleFileExtensions: exts,
    runner: 'jest-runner-rollup',
  };

  if (isMonorepo) {
    jestCfg.moduleDirectories = ['node_modules'].concat(workspaces);
    jestCfg.moduleNameMapper = alias;
  }

  return jestCfg;
};
