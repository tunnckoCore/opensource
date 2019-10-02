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

  /** Load config from possible places */
  const cfg = await tryLoadConfig({ testPath, config, start });
  if (cfg.hasError) return cfg.error;

  /** Find input file */
  const hasExtension = path.extname(testPath).length > 0;
  const inputFile = await tryCatch(testPath, start, () =>
    hasExtension ? testPath : tryExtensions(testPath, config),
  );
  if (inputFile.hasError) return inputFile.error;

  const { pkgHook, formatHook, ...rollupConfig } = cfg;
  const hooks = {
    pkgHook: typeof pkgHook === 'function' ? pkgHook : () => {},
    formatHook: typeof formatHook === 'function' ? formatHook : (x) => x,
  };

  /** Rull that bundle */
  const bundle = await tryCatch(inputFile, start, () =>
    rollup({ ...rollupConfig, input: inputFile }),
  );
  if (bundle.hasError) return bundle.error;

  /** Find correct root path */
  const pkgRoot = isMonorepo(config.cwd)
    ? path.dirname(path.dirname(inputFile))
    : config.rootDir;

  /** Normalize outputs */
  const outputOpts = [].concat(cfg.output).filter(Boolean);
  const outputOptions = outputOpts.map((opt) => {
    const opts = { file: 'dist/index.js', ...opt };

    const dest = path.dirname(opts.file);
    const dist = opts.file.includes(
      opts.format,
    ) /*  || outputOpts.length === 1 */
      ? dest
      : path.join(dest, opts.format);

    const outputFile = path.join(pkgRoot, dist, path.basename(opts.file));

    return hooks.formatHsdfsdfook({
      outputOptions: { ...opts, dist, file: outputFile },
      testPath,
      pkgRoot,
    });
  });

  /** Write output file for each format */
  const res = await tryCatch(inputFile, start, () =>
    Promise.all(
      outputOptions.map(({ outputOptions: outOpts }) =>
        bundle
          .write(outOpts)
          /** If bundled without problems, print the output file filename */
          .then(async () =>
            pass({
              start,
              end: Date.now(),
              test: {
                path: outOpts.file,
                title: 'Rollup',
              },
            }),
          )
          .catch((err) => {
            /** If there is problem bundling, re-throw appending output filename */
            err.outputFile = outOpts.file;
            throw err;
          }),
      ),
    )
      /** Bundling process for each format completed successfuly */
      .then(async (testRes) => {
        await hooks.pkgHook({
          rollupConfig: {
            ...rollupConfig,
            output: outputOptions,
          },
          pkgRoot,
          testPath,
          jestConfig: config,
        });
        return testRes;
      })
      /** Bundling for some of the formats failed */
      .catch((err) =>
        fail({
          start,
          end: new Date(),
          test: {
            path: err.outputFile,
            title: 'Rollup',
            errorMessage: `jest-runner-rollup: ${err.message}`,
          },
        }),
      ),
  );
  if (res.hasError) return res.error;

  return res;
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
