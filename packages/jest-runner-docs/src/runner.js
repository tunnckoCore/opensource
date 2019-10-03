const fs = require('fs');
const path = require('path');

const { pass, fail, skip } = require('@tunnckocore/create-jest-runner');
const { isMonorepo } = require('@tunnckocore/utils');

const cosmiconfig = require('cosmiconfig');
const docks = require('./docks');

// const jestRunnerConfig = cosmiconfig('jest-runner');
// const jestRunnerDocks = cosmiconfig('docks');

// ! todo: support multiple entry files, not only "index"
module.exports = async function jetRunnerDocs({ testPath, config }) {
  const start = new Date();

  const outputFile = await tryCatch(testPath, start, () => {
    const { contents } = docks(testPath);

    if (contents.length === 0) {
      return {
        skip: skip({
          start,
          end: Date.now(),
          test: {
            path: testPath,
            title: 'Docks',
          },
        }),
      };
    }

    /** Find correct root path */
    const pkgRoot = isMonorepo(config.cwd)
      ? path.dirname(path.dirname(testPath))
      : config.rootDir;

    // ! todo: better structure
    const outFile = path.join(pkgRoot, 'docs', 'README.md');
    const outDir = path.dirname(outFile);

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outFile, contents);

    return outFile;
  });
  if (outputFile.hasError) return outputFile.error;

  if (outputFile.skip) return outputFile.skip;

  return pass({
    start,
    end: Date.now(),
    test: {
      path: outputFile,
      title: 'Docks',
    },
  });
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
          title: 'Docks',
          errorMessage: `jest-runner-docs: ${err.message}`,
        },
      }),
    };
  }
}

// async function tryLoadConfig({ testPath, config: jestConfig, start }) {
//   const cfg = await tryCatch(testPath, start, () => {
//     let result = null;
//     result = jestRunnerConfig.searchSync();

//     if (
//       // if `jest-runner.config.js` not found
//       !result ||
//       // or found
//       (result && // but // the `rollup` property is not an object
//         ((result.config.docs && typeof result.config.docs !== 'object') ||
//           // or, the `rolldown` property is not an object
//           (result.config.docks && typeof result.config.docks !== 'object') ||
//           // or, there is not such fields
//           (!result.config.docs || !result.config.docks)))
//     ) {
//       // then we trying `jest-runner-rollup.config.js`
//       result = jestRunnerDocks.searchSync();
//     } else {
//       // if `jest-runner.config.js` found, we try one of both properties
//       result = {
//         ...result,
//         config: result.config.docs || result.config.docks,
//       };
//     }

//     return result;
//   });

//   if (cfg.hasError) return cfg;

//   if (!cfg || (cfg && !cfg.config)) {
//     const filepath = cfg && path.relative(cfg.filepath, jestConfig.cwd);
//     const message = cfg
//       ? `Empty configuration, found at: ${filepath}`
//       : 'Cannot find configuration for Docks.';

//     return {
//       hasError: true,
//       error: fail({
//         start,
//         end: new Date(),
//         test: {
//           path: testPath,
//           title: 'Docks',
//           errorMessage: `jest-runner-docs: ${message}`,
//         },
//       }),
//     };
//   }

//   return cfg.config;
// }

// function tryExtensions(filepath, config) {
//   const { extensions } = getWorkspacesAndExtensions(config.cwd);
//   const hasExtension = path.extname(filepath).length > 0;

//   if (hasExtension) {
//     return filepath;
//   }

//   const extension = extensions.find((ext) => fs.existsSync(filepath + ext));
//   if (!extension) {
//     throw new Error(`Cannot find input file: ${filepath}`);
//   }

//   return filepath + extension;
// }
