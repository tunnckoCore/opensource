const os = require('os');
const fs = require('fs');
const path = require('path');
const { pass, fail } = require('create-jest-runner');
const babel = require('@babel/core');
const cosmiconfig = require('cosmiconfig');

const explorer = cosmiconfig('jest-runner-babel');

const isWin32 = os.platform() === 'win32';

module.exports = async ({ testPath, config }) => {
  const start = new Date();
  const cfg = explorer.searchSync();
  const runnerConfig = Object.assign(
    { monorepo: false, outDir: 'dist', srcDir: 'src' },
    cfg.config,
  );

  runnerConfig.isMonorepo =
    typeof runnerConfig.isMonorepo === 'function'
      ? runnerConfig.isMonorepo
      : () => runnerConfig.monorepo;

  let result = null;

  try {
    result = babel.transformFileSync(testPath, runnerConfig.babel);
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
        errorMessage: 'Babel failing to transform...',
      },
    });
  }

  runnerConfig.outDir = runnerConfig.outDir || runnerConfig.outdir;

  if (typeof runnerConfig.outDir !== 'string') {
    runnerConfig.outDir = 'dist';
  }
  if (typeof runnerConfig.srcDir !== 'string') {
    runnerConfig.srcDir = 'src';
  }

  let { rootDir } = config;
  let relativeTestPath = path.relative(rootDir, testPath);

  if (isWin32 && !relativeTestPath.includes('/')) {
    relativeTestPath = relativeTestPath.replace(/\\/g, '/');
  }

  // [ 'index.js' ]
  // [ 'src', 'index.js' ]
  // [ 'src', 'some', 'index.js' ]
  // [ 'packages', 'foo', 'index.js' ]
  // [ 'packages', 'foo', 'src', 'index.js' ]
  // [ 'packages', 'foo', 'src', 'some', 'index.js' ]
  // so usually need to get the first 2 items

  const segments = relativeTestPath.split('/');

  // if not in monorepo, the `outs.dir` will be empty
  const outs = segments.reduce(
    (acc, item, index) => {
      // only if we are in monorepo we want to get the first 2 items
      if (runnerConfig.isMonorepo(config.cwd) && index < 2) {
        return { ...acc, dir: acc.dir.concat(item) };
      }

      return {
        ...acc,
        file: acc.file
          .concat(item === runnerConfig.srcDir ? null : item)
          .filter(Boolean),
      };
    },
    { file: [], dir: [] },
  );

  let outFile = path.join(
    rootDir,
    ...outs.dir.filter(Boolean),
    runnerConfig.outDir,
    ...outs.file.filter(Boolean),
  );

  const filename = path.basename(outFile, path.extname(outFile));

  const outDir = path.dirname(outFile);
  outFile = path.join(outDir, `${filename}.js`);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, result.code);

  return pass({
    start,
    end: new Date(),
    test: { path: outFile },
  });
};
