const os = require('os');
const fs = require('fs');
const path = require('path');
const { pass, fail } = require('create-jest-runner');
const babel = require('@babel/core');
const cosmiconfig = require('cosmiconfig');

const explorer = cosmiconfig('jest-runner');

const isWin32 = os.platform() === 'win32';

module.exports = async ({ testPath, config }) => {
  const start = new Date();
  const options = normalizeRunnerConfig(explorer.searchSync());

  let result = null;

  try {
    result = babel.transformFileSync(testPath, options.babel);
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

  let relativeTestPath = path.relative(config.rootDir, testPath);

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

  // if not in monorepo, the `outs.dir` will be empty
  const outs = relativeTestPath.split('/').reduce(
    (acc, item, index) => {
      // only if we are in monorepo we want to get the first 2 items
      if (options.isMonorepo(config.cwd) && index < 2) {
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
