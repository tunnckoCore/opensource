/* eslint-disable max-statements */
const fs = require('fs');
const path = require('path');

const { pass, fail, skip } = require('@tunnckocore/create-jest-runner');
const { isMonorepo } = require('@tunnckocore/utils');

const cosmiconfig = require('cosmiconfig');
const docks = require('./docks');
const pkgJson = require('../package.json');

const jestRunnerConfig = cosmiconfig('jest-runner');
const jestRunnerDocks = cosmiconfig('docks');

module.exports = async function jetRunnerDocs({ testPath, config }) {
  const start = new Date();
  const conf = await tryLoadConfig(testPath, start);
  if (conf.hasError) return conf.error;

  const docksConfig = {
    promo: true,
    force: true,
    includeHeader: true,
    outfile: 'docs/README.md',
    ...conf,
  };

  /** Find correct root path */
  const pkgRoot = isMonorepo(config.cwd)
    ? path.dirname(path.dirname(testPath))
    : config.rootDir;

  const outfile = await tryCatch(testPath, start, () => {
    const { contents: apidocsContent } = docks(testPath, pkgRoot);

    if (apidocsContent.length === 0 && !docksConfig.force) {
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

    const outputFile = path.resolve(
      pkgRoot,
      docksConfig.outfile || docksConfig.outFile,
    );

    const promo = docksConfig.promo
      ? `_Generated using [${pkgJson.name}](https://npmjs.com/package/jest-runner-docs)._`
      : '';

    const header = docksConfig.includeHeader ? '## API\n\n' : '';
    const docksStart = '<!-- docks-start -->';
    const docksEnd = '<!-- docks-end -->';
    const contents = `${docksStart}\n${header}${promo}${apidocsContent}\n\n${docksEnd}`;

    if (fs.existsSync(outputFile)) {
      const fileContent = fs.readFileSync(outputFile, 'utf8');

      if (fileContent.includes(docksStart) && fileContent.includes(docksEnd)) {
        const idxStart = fileContent.indexOf(docksStart);
        const idxEnd = fileContent.indexOf(docksEnd) + docksEnd.length;
        const apiPart = fileContent.slice(idxStart, idxEnd);
        const newContents = fileContent.replace(apiPart, contents);

        fs.writeFileSync(outputFile, newContents);
        return outputFile;
      }

      // probably never gets here
      throw new Error(`Outfile doesn't contain placeholders.`);
    }

    const outDir = path.dirname(outputFile);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outputFile, contents);
    return outputFile;
  });

  if (outfile.hasError) return outfile.error;
  if (outfile.skip) return outfile.skip;

  const postHook =
    typeof docksConfig.postHook === 'function'
      ? docksConfig.postHook
      : () => {};

  await postHook({ pkgRoot, jestConfig: config, docksConfig, outfile });

  return pass({
    start,
    end: Date.now(),
    test: {
      path: outfile,
      title: 'Docks',
    },
  });
};

async function tryLoadConfig(testPath, start) {
  return tryCatch(testPath, start, () => {
    const cfg = jestRunnerDocks.searchSync();

    if (!cfg || (cfg && !cfg.config)) {
      const runnersConf = jestRunnerConfig.searchSync();

      if (!runnersConf || (runnersConf && !runnersConf.config)) {
        return {};
      }
      return runnersConf.config.docks || runnersConf.config.docs;
    }

    return cfg.config;
  });
}

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
