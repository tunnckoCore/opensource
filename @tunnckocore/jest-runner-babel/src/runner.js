const os = require('os');
const fs = require('fs');
const path = require('path');
const cosmiconfig = require('cosmiconfig');
const { pass, fail } = require('@tunnckocore/create-jest-runner');
const { transformFileSync } = require('@babel/core');

const explorer = cosmiconfig('jest-runner');

const isWin32 = os.platform() === 'win32';

/* eslint max-statements: ["error", 25] */
module.exports = async function jetRunnerBabel({ testPath, config }) {
  const start = new Date();
  let options = normalizeRunnerConfig(explorer.searchSync());
  const cfgs = [].concat(options.babel).filter(Boolean);

  const testResults = await Promise.all(
    cfgs.reduce((acc, { config: cfg, ...opts }) => {
      options = { ...options, ...opts };

      let result = null;

      const babelConfig = { ...cfg };

      try {
        result = transformFileSync(testPath, babelConfig);
      } catch (err) {
        return acc.concat(
          fail({
            start,
            end: new Date(),
            test: { path: testPath, title: 'Babel', errorMessage: err.message },
          }),
        );
      }

      // Classics in the genre! Yes, it's possible, sometimes.
      // Old habit for ensurance
      if (!result) {
        return acc.concat(
          fail({
            start,
            end: new Date(),
            test: {
              path: testPath,
              title: 'Babel',
              errorMessage: `Babel runner fails...`,
            },
          }),
        );
      }

      let relativeTestPath = path.relative(config.rootDir, testPath);

      if (isWin32 && !relativeTestPath.includes('/')) {
        relativeTestPath = relativeTestPath.replace(/\\/g, '/');
      }

      // if not in monorepo, the `outs.dir` will be empty
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

      const passing = pass({
        start,
        end: new Date(),
        test: { path: outFile, title: 'Babel' },
      });

      if (result.map || babelConfig.sourceMaps === true) {
        const mapFile = `${outFile}.map`;
        fs.writeFileSync(mapFile, JSON.stringify(result.map));

        return acc.concat(
          passing,
          pass({
            start,
            end: new Date(),
            test: { path: mapFile, title: 'Babel' },
          }),
        );
      }

      return acc.concat(passing);
    }, []),
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
