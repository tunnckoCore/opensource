import os from 'os';
import fs from 'fs';
import path from 'path';

import utils from '@tunnckocore/utils';

// import Module from 'module';

/* eslint-disable global-require, import/no-dynamic-require, no-param-reassign */

// import mm from 'micromatch';
import builtins from 'builtin-modules';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from '@wessberg/rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';

import { getGlobals, normalizePkg, upperCamelCase } from 'umd-globals';

import { rollup } from 'rollup';
import { pass, fail } from '@tunnckocore/create-jest-runner';
import cosmiconfig from 'cosmiconfig';

const explorer = cosmiconfig('jest-runner');

const isWin32 = os.platform() === 'win32';

/* eslint max-statements: ["error", 25] */
export default async function jetRunnerRollup({ testPath, config }) {
  const start = new Date();
  let options = normalizeRunnerConfig(explorer.searchSync());
  const cfgs = [].concat(options.rollup).filter(Boolean);

  const testResults = await Promise.all(
    cfgs.reduce(async (acc, { config: cfg, ...opts }) => {
      options = { ...options, ...opts };

      const rollupConfig = { ...cfg, input: testPath };
      let result = null;

      try {
        result = await rollup(rollupConfig);
      } catch (err) {
        return acc.concat(
          fail({
            start,
            end: new Date(),
            test: {
              path: testPath,
              title: 'Rollup',
              errorMessage: err.message,
            },
          }),
        );
      }

      // Classics in the genre! Yes, it's possible, sometimes.
      // Old habit for ensurance
      /* istanbul ignore next */
      if (!result) {
        return acc.concat(
          fail({
            start,
            end: new Date(),
            test: {
              path: testPath,
              title: 'Rollup',
              errorMessage: `Rollup runner fails...`,
            },
          }),
        );
      }

      // const meta = utils.createAliases(config.root, options.srcDir);

      const relativeTestPath = path.relative(config.rootDir, testPath);
      // let pkgRoot = null;
      // if (relativeTestPath.includes(options.srcDir)) {
      //   const parts = relativeTestPath.split('/');
      //   const foundIndex = parts.indexOf(options.srcDir);
      //   pkgRoot = parts.slice(0, foundIndex).join('/');
      // } else {
      //   pkgRoot = path.dirname(pkgRoot);
      // }

      // const outFile = path.join(config.rootDir, pkgRoot, options.outDir);

      // // if not in monorepo, the `outs.dir` will be empty
      const outs = relativeTestPath.split('/').reduce(
        (accumulator, item, idx) => {
          // only if we are in monorepo we want to get the first 2 items
          if (options.isMonorepo(config.cwd) && idx < 2) {
            return { ...accumulator, dir: accumulator.dir.concat(item) };
          }

          return {
            ...accumulator,
            file: accumulator.file
              .concat(item === options.srcDir ? null : item)
              .filter(Boolean),
          };
        },
        { file: [], dir: [] },
      );

      // let outFile = path.join(
      //   config.rootDir,
      //   ...outs.dir.filter(Boolean),
      //   options.outDir,
      //   ...outs.file.filter(Boolean),
      // );

      // const outDir = path.dirname(outFile);
      // outFile = path.join(
      //   outDir,
      //   `${path.basename(outFile, path.extname(outFile))}.js`,
      // );

      // fs.mkdirSync(outDir, { recursive: true });
      // fs.writeFileSync(outFile, result.code);

      // const passing = pass({
      //   start,
      //   end: new Date(),
      //   test: { path: outFile, title: 'Babel' },
      // });

      // if (result.map || babelConfig.sourceMaps === true) {
      //   const mapFile = `${outFile}.map`;
      //   fs.writeFileSync(mapFile, JSON.stringify(result.map));

      //   return acc.concat(
      //     passing,
      //     pass({
      //       start,
      //       end: new Date(),
      //       test: { path: mapFile, title: 'Babel' },
      //     }),
      //   );
      // }

      // return acc.concat(passing);
    }, []),
  );

  return testResults;
}

function normalizeRunnerConfig(val) {
  const cfg = val && val.config ? val.config : {};
  const runnerConfig = {
    monorepo: false,
    outDir: 'dist',
    srcDir: 'src',
    ...cfg,
  };

  runnerConfig.outDir = runnerConfig.outDir || runnerConfig.outdir;

  if (typeof runnerConfig.outDir !== 'string') {
    runnerConfig.outDir = 'dist';
  }
  if (typeof runnerConfig.srcDir !== 'string') {
    runnerConfig.srcDir = 'src';
  }

  runnerConfig.isMonorepo =
    typeof runnerConfig.isMonorepo === 'function'
      ? runnerConfig.isMonorepo
      : () => runnerConfig.monorepo;

  return runnerConfig;
}
