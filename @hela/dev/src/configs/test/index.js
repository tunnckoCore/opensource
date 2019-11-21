/* eslint-disable import/no-dynamic-require, global-require */

import fs from 'fs';
import path from 'path';
import utils from '@tunnckocore/utils';
import isCI from 'is-ci';
import picomatch from 'picomatch';

// eslint-disable-next-line max-statements
export default (options) => {
  const opts = { cwd: process.cwd(), ...options };
  const { exts, workspaces, info, alias } = utils.createAliases(opts.cwd);
  const ignores = []
    .concat(opts.ignores)
    .filter(Boolean)
    .map((x) =>
      typeof x === 'string' ? new RegExp(x).toString() : x.toString(),
    );

  const tests = ['test', 'tests', '__test__', '__tests__'];
  const isMonorepo = workspaces.length > 0;

  let testMatch = null;

  if (isMonorepo) {
    testMatch = workspaces
      .map(
        (ws) =>
          `<rootDir>/${ws}/*/{${tests.join(',')}}/**/*.{${exts.join(',')}}`,
      )
      .concat(ignores);
  } else {
    testMatch = [`<rootDir>/{${tests.join(',')}}/**/*.{${exts.join(',')}}`];
  }

  const jestCfg = {
    rootDir: opts.cwd,
    displayName: 'test',
    testMatch,
    testPathIgnorePatterns: [
      /node_modules/.toString(),
      /(?:__)?(?:fixtures?|supports?|shared|snapshots)(?:__)?/.toString(),
    ].concat(ignores),
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  };

  if (isMonorepo) {
    jestCfg.moduleDirectories = ['node_modules'].concat(workspaces);
    jestCfg.moduleNameMapper = alias;
  }

  if (isCI && !isMonorepo) {
    const { jest } = require(path.join(opts.cwd, 'package.json'));
    return { ...jest, ...jestCfg, collectCoverage: true };
  }

  // collect coveragePathIgnorePatterns and coverageThreshold
  // from each package's package.json `jest` field and merge them
  // in one object that later put in the jest config
  if (isCI && isMonorepo) {
    const res = Object.keys(info)
      .filter((key) => fs.existsSync(path.join(opts.cwd, key, 'package.json')))
      .reduce(
        (acc, pkgDir) => {
          const pkgRootDir = path.join(opts.cwd, pkgDir);

          const {
            jest: {
              coverageThreshold = {},
              coveragePathIgnorePatterns = [],
            } = {},
          } = require(path.join(pkgRootDir, 'package.json'));

          const patterns = []
            .concat(coveragePathIgnorePatterns)
            .filter(Boolean)
            .map((x) => {
              const pattern = path.join(pkgDir, x);
              const regex = picomatch.makeRe(pattern);

              // coveragePathIgnorePatterns must be regex strings (KIND OF!!),
              // but we actually passing globs,
              // plus we remove `/^` and `$/` which micromatch adds
              return regex.toString().slice(2, -2);
            });

          acc.coveragePathIgnorePatterns = acc.coveragePathIgnorePatterns.concat(
            patterns,
          );

          Object.keys(coverageThreshold).forEach((key) => {
            const pattern = path.join(pkgDir, key);
            acc.coverageThreshold[pattern] = coverageThreshold[key];
            return acc;
          });

          return acc;
        },
        { coverageThreshold: {}, coveragePathIgnorePatterns: [] },
      );

    const { jest } = require(path.join(opts.cwd, 'package.json'));
    const covPatterns = []
      .concat(jest.coveragePathIgnorePatterns)
      .filter(Boolean);
    const covThreshold = jest.coverageThreshold;

    res.coveragePathIgnorePatterns = covPatterns
      // do the same, but for the monorepo's root jest.coveragePathIgnorePatterns
      .map((x) => {
        const regex = picomatch.makeRe(x);

        // coveragePathIgnorePatterns must be regex strings (KIND OF!!),
        // but we actually passing globs,
        // plus we remove `/^` and `$/` which micromatch adds
        return regex.toString().slice(2, -2);
      })
      .concat(res.coveragePathIgnorePatterns);
    res.coverageThreshold = { ...res.coverageThreshold, ...covThreshold };

    return { ...jestCfg, ...res, collectCoverage: true };
  }

  return jestCfg;
};
