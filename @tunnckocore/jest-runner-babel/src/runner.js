const os = require('os');
const fs = require('fs');
const path = require('path');
const { transformFileSync, loadPartialConfig } = require('@babel/core');
const {
  pass,
  skip,
  runner,
  utils,
} = require('@tunnckocore/create-jest-runner');

const isWin32 = os.platform() === 'win32';

process.env.NODE_ENV = 'build';

/* eslint max-statements: ["error", 25] */
module.exports = runner('babel', async (ctx) => {
  const start = Date.now();
  const { testPath, config, runnerName, runnerConfig, memoizer } = ctx;
  let options = runnerConfig;
  const cfgs = [options].flat().filter(Boolean);

  if (cfgs.length === 0) {
    const babelCfg = loadPartialConfig();

    if (babelCfg.config) {
      cfgs.push(babelCfg.options);
    } else {
      return skip({
        start,
        end: Date.now(),
        test: {
          path: testPath,
          title: 'babel',
        },
      });
    }
  }

  const results = cfgs.reduce(async (prevPromise, { config: cfg, ...opts }) => {
    const acc = await prevPromise;
    options = normalizeOptions({ ...opts });

    const babelConfig = { ...cfg };

    const result = await utils.tryCatch(
      async () => {
        const transform = await memoizer.memoize(
          (...args) => transformFileSync(...args),
          babelConfig,
          { cacheId: 'transform-with-cfg' },
        );
        const res = await transform(testPath, babelConfig);
        return res;
      },
      { start, testPath, runnerName, runnerConfig },
    );

    if (result.hasError) return acc.concat(result.error);

    let relativeTestPath = path.relative(config.rootDir, testPath);
    if (isWin32 && !relativeTestPath.includes('/')) {
      relativeTestPath = relativeTestPath.replace(/\\/g, '/');
    }

    // eslint-disable-next-line prefer-const
    let { outFile, outDir } = createOuts({ relativeTestPath, config, options });

    outFile = path.join(
      outDir,
      `${path.basename(outFile, path.extname(outFile))}.js`,
    );

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outFile, result.code);

    const passing = pass({
      start,
      end: Date.now(),
      test: { path: outFile, title: 'babel' },
    });

    if (result.map || babelConfig.sourceMaps === true) {
      const mapFile = `${outFile}.map`;
      fs.writeFileSync(mapFile, JSON.stringify(result.map));
      return acc.concat(
        passing,
        pass({
          start,
          end: Date.now(),
          test: { path: mapFile, title: 'babel' },
        }),
      );
    }

    return acc.concat(passing);
  }, Promise.resolve([]));

  // eslint-disable-next-line no-return-await
  return await Promise.all(await results);
});

function normalizeOptions(cfg) {
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

function createOuts({ relativeTestPath, config, options }) {
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

  const outFile = path.join(
    config.rootDir,
    ...outs.dir.filter(Boolean),
    options.outDir,
    ...outs.file.filter(Boolean),
  );
  const outDir = path.dirname(outFile);

  return { outFile, outDir };
}
