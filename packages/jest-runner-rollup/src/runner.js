const fs = require('fs');
const path = require('path');

const { pass, fail } = require('@tunnckocore/create-jest-runner');
const {
  getWorkspacesAndExtensions,
  isMonorepo,
} = require('@tunnckocore/utils');
const { rollup } = require('rollup');
const cosmiconfig = require('cosmiconfig');

const jestRunnerConfig = cosmiconfig('jest-runner');
const jestRunnerRollupConfig = cosmiconfig('jest-runner-rollup');
const rollupConfigFile = cosmiconfig('rollup');

module.exports = async function jetRunnerRollup({ testPath, config }) {
  const start = new Date();
  const cfg = await tryLoadConfig({ testPath, config, start });
  if (cfg.hasError) return cfg.error;

  const hasExtension = path.extname(testPath).length > 0;
  const inputFile = await tryCatch(testPath, start, () =>
    hasExtension ? testPath : tryExtensions(testPath, config),
  );
  if (inputFile.hasError) return inputFile.error;

  const bundle = await tryCatch(inputFile, start, () =>
    rollup({ ...cfg, input: inputFile }),
  );
  if (bundle.hasError) return bundle.error;

  const pkgRoot = isMonorepo(config.cwd)
    ? path.dirname(path.dirname(inputFile))
    : config.rootDir;

  console.log({ a: config.rootDir });
  const outputOptions = { dest: 'builds', file: 'index.js', ...cfg.output };

  const outDir = outputOptions.dest.replace(/^\/|\/$/, '');
  let outFile = outputOptions.file.replace(/^\/|\/$/, '');
  outFile = outFile.startsWith(outDir) ? outFile.slice(outDir.length) : outFile;
  outFile = outFile.replace(/^\/|\/$/, '');
  const outputFile = path.join(pkgRoot, outDir, outFile);

  // console.log({ pkgRoot, outDir, outFile, outputFile });

  const res = await tryCatch(inputFile, start, () =>
    bundle.write({ ...outputOptions, file: outputFile }),
  );
  if (res.hasError) return res.error;

  return pass({
    start,
    end: Date.now(),
    test: {
      path: outputFile,
      title: 'Rollup',
    },
  });
};

async function tryCatch(testPath, start, fn) {
  try {
    return fn();
  } catch (err) {
    return {
      hasError: true,
      error: fail({
        start,
        end: new Date(),
        test: {
          path: testPath,
          title: 'Rollup',
          errorMessage: `jest-runner-rollup: ${err.message}`,
        },
      }),
    };
  }
}

async function tryLoadConfig({ testPath, config: jestConfig, start }) {
  const cfg = await tryCatch(testPath, start, () => {
    let result = null;
    result = jestRunnerConfig.searchSync();

    if (
      // if `jest-runner.config.js` not found
      !result ||
      // or found
      (result && // but // the `rollup` property is not an object
        ((result.config.rollup && typeof result.config.rollup !== 'object') ||
          // or, the `rolldown` property is not an object
          (result.config.rolldown &&
            typeof result.config.rolldown !== 'object') ||
          // or, there is not such fields
          (!result.config.rollup || !result.config.rolldown)))
    ) {
      // then we trying `jest-runner-rollup.config.js`
      result = jestRunnerRollupConfig.searchSync();
    } else {
      // if `jest-runner.config.js` found, we try one of both properties
      result = {
        ...result,
        config: result.config.rollup || result.config.rolldown,
      };
    }

    // if still not found, try regular/original rollup configs,
    // like `rollup.config.js`, `.rolluprc.js`, a `rollup` field in package.json,
    // or a `.rolluprc.json` and etc
    if (!result) {
      result = rollupConfigFile.searchSync();
    }

    return result;
  });

  if (cfg.hasError) return cfg;

  if (!cfg || (cfg && !cfg.config)) {
    const filepath = cfg && path.relative(cfg.filepath, jestConfig.cwd);
    const message = cfg
      ? `Empty configuration, found at: ${filepath}`
      : 'Cannot find configuration for Rollup.';

    return {
      hasError: true,
      error: fail({
        start,
        end: new Date(),
        test: {
          path: testPath,
          title: 'Rollup',
          errorMessage: `jest-runner-rollup: ${message}`,
        },
      }),
    };
  }

  return cfg.config;
}

function tryExtensions(filepath, config) {
  const { extensions } = getWorkspacesAndExtensions(config.cwd);
  const hasExtension = path.extname(filepath).length > 0;

  if (hasExtension) {
    return filepath;
  }

  const extension = extensions.find((ext) => fs.existsSync(filepath + ext));
  if (!extension) {
    throw new Error(`Cannot find input file: ${filepath}`);
  }

  return filepath + extension;
}
