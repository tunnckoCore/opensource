/* eslint-disable max-statements */
/* eslint-disable promise/prefer-await-to-callbacks */
/* eslint-disable promise/prefer-await-to-then */
import os from 'os';
import fs from 'fs';
import path from 'path';

import pMapSeries from 'p-map-series';
import pReduce from 'p-reduce';
import { createAliases } from '@tunnckocore/utils';

import Debug from 'debug';

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

import { rollup as Rollup } from 'rollup';
import { pass, fail } from '@tunnckocore/create-jest-runner';
import cosmiconfig from 'cosmiconfig';

const debug = Debug('rollup-runner');

const explorer = cosmiconfig('jest-runner');

const isWin32 = os.platform() === 'win32';

function tryExtensions(filepath, extensions) {
  const hasExtension = path.extname(filepath).length > 0;

  if (hasExtension) {
    return filepath;
  }

  // if `--input foo` check `pkg-name/foo.<ext>` (e.g. the root of repo or package)
  let extension = extensions.find((ext) => fs.existsSync(filepath + ext));

  if (!extension) {
    const dirname = path.dirname(filepath);
    const input = path.basename(filepath);
    filepath = path.join(dirname, 'src', input);

    // if `--input foo` check `pkg-name/src/foo.<ext>`
    extension = extensions.find((x) => fs.existsSync(filepath + x));
  }

  if (!extension) {
    throw new Error(`Cannot find input file: ${filepath}`);
  }

  return filepath + extension;
}

/* eslint max-statements: ["error", 25] */
export default async function jetRunnerRollup({ testPath, config }) {
  const start = new Date();
  let options = normalizeRunnerConfig(explorer.searchSync());
  const cfgs = [].concat(options.rollup).filter(Boolean);

  const { extensions, packageJson } = createAliases(
    config.rootDir,
    options.srcDir,
  );
  const collectedResults = [];

  await Promise.all(
    cfgs.map(({ config: cfg, ...opts }) => {
      options = { ...options, ...opts };

      const rollupConfig = {
        ...cfg,
        input: (cfg && cfg.input) || options.input || testPath,
      };

      rollupConfig.input = tryExtensions(rollupConfig.input, extensions);

      return Rollup(rollupConfig).then(async (rollupResponse) => {
        const isTsInput = /\.tsx?/.test(rollupConfig.input);

        if (isTsInput && !extensions.includes('.ts')) {
          extensions.unshift('.ts', '.tsx');
        }

        let relativeTestPath = path.relative(config.rootDir, testPath);

        if (isWin32 && !relativeTestPath.includes('/')) {
          relativeTestPath = relativeTestPath.replace(/\\/g, '/');
        }

        let outDir = options.outDir || options.outdir;
        if (isWin32 && !outDir.includes('/')) {
          outDir = outDir.replace(/\\/g, '/');
        }

        const outputs = [].concat(rollupConfig.output).filter(Boolean);

        if (outputs.length === 0) {
          outputs.push('esm', 'cjs');
        }

        return Promise.all(
          outputs
            .map((outputOptions) =>
              createOutputReducer({
                options,
                ...createOuts({
                  relativeTestPath,
                  config,
                  rollupConfig,
                  options,
                }),
                start,
                rollup: rollupResponse,
              })(outputOptions),
            )
            .map(async (promise) => {
              const { passing, failing } = await promise;
              if (passing) {
                collectedResults.push(passing);
              } else {
                collectedResults.push(failing);
              }
            }),
        );
      });
    }),
  );

  debug('length of collectedResults %d', collectedResults.length);

  // debug('RESULLLLLLLLLLLLLT %s', typeof res);

  // const passing = pass({
  //   start,
  //   end: new Date(),
  //   test: { path: testPath, title: 'Rollup' },
  // });

  // const failing = fail({
  //   start,
  //   end: new Date(),
  //   test: {
  //     title: 'Rollup',
  //     path: testPath /* or testPath? */,
  //     errorMessage: 'Rollup fails to write files...',
  //   },
  // });

  // console.log(passing);
  // console.log(failing);

  // return passing;
  // console.log(testResults);

  // const str = JSON.stringify(collectedResults.testResults, null, 2);
  // debug('collected testResults: %s', str);

  return collectedResults.filter(Boolean)[0];
  // return pass({
  //   start,
  //   end: new Date(),
  //   test: { path: testPath, title: 'Rollup' },
  // });
}

function createOuts({ relativeTestPath, config, rollupConfig, options }) {
  // if not in monorepo, the `outs.dir` will be empty
  const outs = relativeTestPath.split('/').reduce(
    (accumulator, item, idx) => {
      // only if we are in monorepo we want to get the first 2 items
      // this thing basically gets all between the monorepo root
      // and the package's root directory
      if (options.isMonorepo(config.cwd) && idx < options.depth) {
        return { ...accumulator, dir: accumulator.dir.concat(item) };
      }

      return {
        ...accumulator,
        file: accumulator.file
          .concat(item === options.srcDir ? 0 : item)
          .filter(Boolean),
      };
    },
    { file: [], dir: [] },
  );

  const packageRoot = path.join(config.rootDir, ...outs.dir.filter(Boolean));

  const notypesProjectPath = path.join(config.cwd, 'tsconfig.notypes.json');
  const notypesConfig = fs.existsSync(notypesProjectPath)
    ? notypesProjectPath
    : path.join(__dirname, 'tsconfig.notypes.json');

  const extern = rollupConfig.externals || options.externals;
  const passedExternals = []
    .concat(extern)
    .filter(Boolean)
    .reduce((acc, extr) => acc.concat(extr.split(',')), []);

  const packageJsonRoot = JSON.parse(
    fs.readFileSync(packageRoot, 'package.json'),
  );

  const { node, peerDependencies, dependencies } = packageJsonRoot;
  const shouldResolve = rollupConfig.bundleDeps || options.bundleDeps;
  const external = [].concat(passedExternals).concat(
    // if we want them to be resolved, we should not add
    // them to the `external`s array option
    shouldResolve
      ? []
      : Object.keys(peerDependencies).concat(Object.keys(dependencies)),
    node ? builtins : [],
  );

  const pkgGlobals = external.reduce((acc, x) => {
    if (acc[x] == null) {
      const normalizedPackageName = upperCamelCase(normalizePkg(x));
      return { ...acc, [x]: normalizedPackageName };
    }
    return acc;
  }, rollupConfig.globals || options.globals);

  return {
    packageRoot,
    filepath: outs.file.filter(Boolean),
    external,
    pkgGlobals,
    notypesConfig,
  };
}

function createOutputReducer({
  options,
  external,
  packageRoot,
  pkgGlobals,
  notypesConfig,
  filepath,
  start,
  rollup,
}) {
  return async (outputOptions) => {
    const optsOutput =
      typeof outputOptions === 'string'
        ? { format: outputOptions }
        : outputOptions;

    const getOutFile = (fmt) =>
      path.join(packageRoot, options.outDir, fmt, filepath);

    const outputFile = getOutFile(optsOutput.format);

    const fileParentDirname = path.dirname(outputFile);
    let ext = options.outputExtension;
    ext = typeof ext === 'string' ? ext : 'js';
    ext = ext.startsWith('.') ? ext.slice(1) : ext;

    const file = path.join(
      fileParentDirname,
      `${path.basename(outputFile, path.extname(outputFile))}.${ext}`,
    );

    const rollupOutOptions = {
      ...optsOutput,
      external,
      globals: pkgGlobals,
      file,
    };

    return new Promise((resolve) => {
      rollup
        .write(rollupOutOptions)
        .then(() => {
          resolve({
            passing: pass({
              start,
              end: new Date(),
              test: { path: file, title: 'Rollup' },
            }),
          });
        })
        .catch((err) => {
          resolve({
            failing: fail({
              start,
              end: new Date(),
              test: {
                title: 'Rollup',
                path: file,
                errorMessage: err.message,
              },
            }),
          });
        });
    });

    // let res = null;

    // try {
    //   res = await rollup.write(rollupOutOptions);
    // } catch (err) {
    //   return acc.concat(
    //     fail({
    //       start,
    //       end: new Date(),
    //       test: {
    //         title: 'Rollup',
    //         path: testPath /* or testPath? */,
    //         errorMessage: err.message,
    //       },
    //     }),
    //   );
    // }

    // if (!res) {
    //   return acc.concat(
    //     fail({
    //       start,
    //       end: new Date(),
    //       test: {
    //         title: 'Rollup',
    //         path: testPath /* or testPath? */,
    //         errorMessage: 'Rollup fails to write files...',
    //       },
    //     }),
    //   );
    // }

    // return acc.concat(
    //   pass({
    //     start,
    //     end: new Date(),
    //     test: { path: optsOutput.file, title: 'Rollup' },
    //   }),
    // );
  };
}

function normalizeRunnerConfig(val) {
  const cfg = val && val.config ? val.config : {};
  const runnerConfig = {
    monorepo: false,
    outDir: 'dist',
    srcDir: 'src',
    depth: 2,
    outputExtension: 'js',
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
