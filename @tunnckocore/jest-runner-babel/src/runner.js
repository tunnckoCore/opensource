import os from 'os';
import fs from 'fs';
import path from 'path';

import { pass, fail } from '@tunnckocore/create-jest-runner';
import { transformFileSync } from '@babel/core';
import cosmiconfig from 'cosmiconfig';

const explorer = cosmiconfig('jest-runner');

const isWin32 = os.platform() === 'win32';

export default async ({ testPath, config }) => {
  const start = new Date();
  let options = normalizeRunnerConfig(explorer.searchSync());
  const cfgs = [].concat(options.babel).filter(Boolean);

  const testResults = await Promise.all(
    cfgs.map(({ config: cfg, ...opts }) => {
      options = { ...options, ...opts };
      let result = null;
      // index += 1;

      try {
        result = transformFileSync(testPath, cfg);
      } catch (err) {
        return fail({
          start,
          end: new Date(),
          test: { path: testPath, title: 'Babel', errorMessage: err.message },
        });
      }

      // Classics in the genre! Yes, it's possible, sometimes.
      // Old habit for ensurance
      if (!result) {
        return fail({
          start,
          end: new Date(),
          test: {
            path: testPath,
            title: 'Babel',
            errorMessage: `Babel runner fails...`,
          },
        });
      }

      let relativeTestPath = path.relative(config.rootDir, testPath);

      if (isWin32 && !relativeTestPath.includes('/')) {
        relativeTestPath = relativeTestPath.replace(/\\/g, '/');
      }

      // if not in monorepo, the `outs.dir` will be empty
      const outs = relativeTestPath.split('/').reduce(
        (acc, item, idx) => {
          // only if we are in monorepo we want to get the first 2 items
          if (options.isMonorepo(config.cwd) && idx < 2) {
            return { ...acc, dir: acc.dir.concat(item) };
          }

          return {
            ...acc,
            file: acc.file
              .concat(item === options.srcDir ? null : item)
              .filter(Boolean),
          };
        },
        { file: [], dir: [] },
      );

      let outFile = path.join(
        config.rootDir,
        ...outs.dir.filter(Boolean),
        options.outDir,
        ...outs.file.filter(Boolean),
      );

      const outDir = path.dirname(outFile);
      outFile = path.join(
        outDir,
        `${path.basename(outFile, path.extname(outFile))}.js`,
      );

      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(outFile, result.code);

      return pass({
        start,
        end: new Date(),
        test: { path: outFile, title: 'Babel' },
      });
    }),
  );

  return testResults;
};

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
