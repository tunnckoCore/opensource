import path from 'path';
import utils from '@tunnckocore/utils';

export default (options) => {
  const opts = { cwd: process.cwd(), ...options };
  const { exts, alias, workspaces } = utils.createAliases(opts.cwd);
  const ignores = []
    .concat(opts.ignores)
    .filter(Boolean)
    .map((x) => (typeof x === 'string' ? x : x.toString()));

  const isMonorepo = workspaces.length > 0;
  const inputs = [].concat(opts.input).filter(Boolean);
  let testMatch = null;

  // if monorepo setup
  if (isMonorepo) {
    testMatch = Object.values(alias).map((source) => {
      const src = source.endsWith('src') ? path.dirname(source) : source;

      return `${src}/**/*`;
    });
  } else {
    testMatch =
      inputs.length > 0
        ? inputs
        : [`<rootDir>/{src,test,tests,__test__,__tests__}/**/*`];
  }

  const jestCfg = {
    rootDir: opts.cwd,
    displayName: 'lint',
    testMatch,
    testPathIgnorePatterns: [
      /node_modules/.toString(),
      /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
    ].concat(ignores),
    moduleFileExtensions: exts,
    runner: '@tunnckocore/jest-runner-eslint',
  };

  if (isMonorepo) {
    jestCfg.moduleDirectories = ['node_modules'].concat(workspaces);
    jestCfg.moduleNameMapper = alias;
  }

  return jestCfg;
};
