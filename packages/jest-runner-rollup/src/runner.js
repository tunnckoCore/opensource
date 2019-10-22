const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const builtins = require('builtin-modules');
const { pass, fail, skip } = require('@tunnckocore/create-jest-runner');
const {
  getWorkspacesAndExtensions,
  isMonorepo,
} = require('@tunnckocore/utils');
const { rollup } = require('rollup');
const cosmiconfig = require('cosmiconfig');

const jestRunnerConfig = cosmiconfig('jest-runner');
const jestRunnerRollupConfig = cosmiconfig('jest-runner-rollup');
const rollupConfigFile = cosmiconfig('rollup');

const ROLLUP_CACHE = {};
const CACHE_DIR = path.join(
  process.cwd(), // to do
  'node_modules',
  '.cache',
  'jest-runner-rollup',
);

process.env.NODE_ENV = 'bundle';

/* eslint-disable max-statements */
module.exports = async function jestRunnerRollup({ testPath, config }) {
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

  /** Find correct root path */
  const pkgRoot = isMonorepo(config.cwd)
    ? path.dirname(path.dirname(inputFile))
    : config.rootDir;

  const { hooks, skipCached = false } = cfg;
  const allHooks = {
    onPkg: typeof hooks.onPkg === 'function' ? hooks.onPkg : () => {},
    onFormat: typeof hooks.onFormat === 'function' ? hooks.onFormat : (x) => x,
    onWrite: typeof hooks.onWrite === 'function' ? hooks.onWrite : (x) => x,
  };

  const { fresh = process.env.ROLLUP_FORCE_RELOAD, ...rollupConfig } = cfg;

  const fileContents = fs.readFileSync(inputFile, 'utf8');
  const contentsHash = revHash(fileContents);
  const configHash = revHash(JSON.stringify(rollupConfig));
  const fileHash = revHash(inputFile);
  const cacheFile = path.join(CACHE_DIR, `${fileHash}.json`);
  let hasCache = !fresh && fs.existsSync(cacheFile);
  hasCache = hasCache ? fs.existsSync(path.join(pkgRoot, 'dist')) : 0;

  let cacheCollection = null;
  if (hasCache) {
    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      cacheCollection = require(cacheFile);
    } catch (err) {
      cacheCollection = {};
    }
  }
  hasCache = hasCache && cacheCollection.configHash === configHash ? 1 : 0;
  hasCache = hasCache && cacheCollection.contentsHash === contentsHash ? 1 : 0;

  /** Some sane defaults */
  const { dependencies = {} } = await tryCatch(
    // eslint-disable-next-line import/no-dynamic-require, global-require
    () => require(path.join(pkgRoot, 'package.json')),
    { testPath, start },
  );
  const externals = Object.keys(dependencies).concat(builtins);

  if (Array.isArray(rollupConfig.external)) {
    externals.push(...rollupConfig.external);
  }

  /** Roll that bundle */
  const bundle = !hasCache
    ? await tryCatch(inputFile, start, () =>
        rollup({
          ...rollupConfig,
          input: inputFile,
          cache: ROLLUP_CACHE[inputFile],
          external: (id) =>
            typeof rollupConfig.external === 'function'
              ? rollupConfig.external(id, externals)
              : externals.includes(id) && id.includes('/'),
        }),
      )
    : {};
  if (bundle.hasError) return bundle.error;

  if (!hasCache) {
    ROLLUP_CACHE[cacheFile] = ROLLUP_CACHE[cacheFile] || bundle.cache;
    fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
    fs.writeFileSync(cacheFile, JSON.stringify({ configHash, contentsHash }));
  }

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

    return hooker(allHooks.onFormat, {
      outputOptions: { ...opts, dist, file: outputFile },
      pkgRoot,
      testPath,
      inputFile,
    });
  });

  // If has cache, make passing/skip test report
  // it's just for the sake to not confuse user
  if (hasCache) {
    const ret = await tryCatch(inputFile, start, () =>
      Promise.all(
        outputOptions.map(async (ctx) => {
          const { outputOptions: outOpts } = await ctx;

          return (skipCached ? skip : pass)({
            start,
            end: Date.now(),
            test: {
              path: outOpts.file,
              title: 'Rollup',
            },
          });
        }),
      ),
    );
    if (ret.hasError) return ret.error;

    return ret;
  }

  /** Write output file for each format */
  const res = await tryCatch(inputFile, start, () =>
    Promise.all(
      outputOptions.map(async (ctx) => {
        const { outputOptions: outOpts } = await ctx;

        const opts = await hooker(allHooks.onWrite, {
          outputOptions: outOpts,
          pkgRoot,
          testPath,
          inputFile,
        });

        return (
          bundle
            .write(opts.outputOptions)
            /** If bundled without problems, print the output file filename */
            .then(async () =>
              pass({
                start,
                end: Date.now(),
                test: {
                  path: opts.outputOptions.file,
                  title: 'Rollup',
                },
              }),
            )
            .catch((err) => {
              /** If there is problem bundling, re-throw appending output filename */
              err.outputFile = opts.outputOptions.file;
              throw err;
            })
        );
      }),
    )
      /** Bundling process for each format completed successfuly */
      .then(async (testRes) => {
        await hooker(allHooks.onPkg, {
          jestConfig: config,
          rollupConfig: {
            ...rollupConfig,
            output: outputOptions,
          },
          pkgRoot,
          testPath,
          inputFile,
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
            errorMessage: `jest-runner-rollup: ${err.stack || err.message}`,
          },
        }),
      ),
  );
  if (res.hasError) return res.error;

  return res;
};

async function tryCatch(testPath, start, fn) {
  try {
    return await fn();
  } catch (err) {
    return {
      hasError: true,
      error: fail({
        start,
        end: new Date(),
        test: {
          path: testPath,
          title: 'Rollup',
          errorMessage: `jest-runner-rollup: ${err.stack || err.message}`,
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

  if (cfg && cfg.hasError) return cfg;

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

async function hooker(hookFn, options = {}) {
  const hookResult = await hookFn({ ...options });
  const res = { ...hookResult };

  if (res.outputOptions) {
    return { ...options, ...res };
  }

  return { ...options, outputOptions: res };
}

function revHash(input) {
  return crypto
    .createHash('md5')
    .update(input)
    .digest('hex')
    .slice(0, 15);
}
