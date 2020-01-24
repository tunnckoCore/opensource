'use strict';

/* eslint-disable max-statements */
const fs = require('fs');
const path = require('path');

const { pass, fail, skip } = require('@tunnckocore/create-jest-runner');
const { isMonorepo } = require('@tunnckocore/utils');
const findPkg = require('find-pkg');

// const { cosmiconfigSync } = require('cosmiconfig');
const docks = require('./docks.js');

// const jestRunnerConfig = cosmiconfigSync('jest-runner');

// let RUNNERS_CONF = {};

// try {
//   const cfg = jestRunnerConfig.search();
//   if (cfg && cfg.config) {
//     RUNNERS_CONF = cfg.config.docks || cfg.config.docs;
//   }
// } catch (err) {}

process.env.NODE_ENV = 'docs';

module.exports = async function jestRunnerDocs({ testPath, config }) {
  const start = new Date();
  // const conf = RUNNERS_CONF;

  // if (conf.hasError) return conf.error;

  const docksConfig = {
    promo: false,
    verbose: true,
    force: true,
    includeHeader: false,
    outfile: '.verb.md',
    // ...conf,
  };
  docksConfig.outfile = docksConfig.outfile || docksConfig.outFile;
  // console.log(docksConfig);
  /** Find correct root path */
  const pkgRoot = isMonorepo(config.cwd)
    ? path.dirname(findPkg.sync(path.dirname(testPath)))
    : config.rootDir;

  /** Handle if index.js is inside root (no src dirs in root of package) */
  // pkgRoot = fs.existsSync(path.join(pkgRoot, 'package.json'))
  //   ? pkgRoot
  //   : path.dirname(pkgRoot);

  const outfile = await tryCatch(
    () => {
      const { contents: apidocsContent } = docks(testPath, pkgRoot);

      if (apidocsContent.length === 0 && !docksConfig.force) {
        return {
          skip: skip({
            start,
            end: new Date(),
            test: {
              path: testPath,
              title: 'Docks',
            },
          }),
        };
      }

      // const newPath = path.join(path.dirname(testPath), `${basename}.md`);
      const relPath = path.relative(pkgRoot, testPath);
      // const basename = path.basename(relPath, path.extname(relPath));

      const outputFile = path.resolve(pkgRoot, docksConfig.outfile);
      // const outputFile = path.join(pkgRoot, relPath);

      const promo = docksConfig.promo
        ? `_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._`
        : '';

      const header = docksConfig.includeHeader ? '## API\n\n' : '';
      const docksStart = '<!-- docks-start -->';
      const docksEnd = '<!-- docks-end -->';
      // const docksStart = `<!-- docks-start -->`;
      // const docksEnd = `<!-- docks-end -->`;
      const cont =
        apidocsContent.length > 0
          ? `\n\n${header}${promo}${apidocsContent.trim()}\n\n`
          : '\n';

      const contents = (x = '') => `${docksStart}${cont}${x}${docksEnd}`;
      let fileContents = null;

      if (fs.existsSync(outputFile)) {
        fileContents = fs.readFileSync(outputFile, 'utf8');

        if (
          fileContents.includes(docksStart) &&
          fileContents.includes(docksEnd)
        ) {
          const idxStart = fileContents.indexOf(docksStart) + docksStart.length;
          const idxEnd = fileContents.indexOf(docksEnd);

          // ! TODO!
          const oldDocksContents = fileContents.slice(idxStart, idxEnd);
          // const beforeDocks = fileContents.slice(0, idxStart).trim();
          // const afterDocks = fileContents.slice(idxEnd).trim();

          fs.writeFileSync(outputFile, contents(oldDocksContents));
        }
      } else {
        const outDir = path.dirname(outputFile);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(outputFile, contents());
      }

      return testPath;
      // if (fs.existsSync(outputFile)) {
      //   const fileContent = fs.readFileSync(outputFile, 'utf8');

      //   // if (
      //   //   fileContent.includes(docksStart) &&
      //   //   fileContent.includes(docksEnd)
      //   // ) {
      //   const idxStart = fileContent.indexOf(docksStart);
      //   const idxEnd = fileContent.indexOf(docksEnd) + docksEnd.length;
      //   const apiPart = fileContent.slice(idxStart, idxEnd);

      //   const newContents = fileContent.replace(
      //     apiPart,
      //     `${apiPart.trim()}\n${docksStart}${cont}${docksEnd}\n`,
      //     // `${apiPartWithoutDocksEnd}${cont}${docksEnd}`,
      //   );

      //   // fs.mkdirSync(path.dirname(outputFile), { recursive: true });
      //   fs.writeFileSync(outputFile, newContents);
      //   return outputFile;
      //   // }

      //   // // probably never gets here
      //   // throw new Error(`Outfile doesn't contain placeholders.`);
      // }

      // const outDir = path.dirname(outputFile);
      // fs.mkdirSync(outDir, { recursive: true });
      // fs.writeFileSync(outputFile, contents);
      // return outputFile;
    },
    { testPath, start, cfg: docksConfig },
  );

  if (outfile.hasError) return outfile.error;
  if (outfile.skip) return outfile.skip;

  const postHook =
    typeof docksConfig.postHook === 'function'
      ? docksConfig.postHook
      : () => {};

  const res = await tryCatch(
    () =>
      postHook({
        pkgRoot,
        jestConfig: config,
        docksConfig,
        outfile,
        outFile: outfile,
      }),
    { start, testPath, cfg: docksConfig },
  );
  if (res && res.hasError) return res.error;

  return pass({
    start,
    end: new Date(),
    test: {
      path: outfile,
      title: 'Docks',
    },
  });
};

// async function tryLoadConfig(testPath, start) {
//   return tryCatch(
//     async () => {
//       RUNNERS_CONF = RUNNERS_CONF || (await jestRunnerConfig.search());

//       if (!RUNNERS_CONF || (RUNNERS_CONF && !RUNNERS_CONF.config)) {
//         return {};
//       }
//       return RUNNERS_CONF.config.docks || RUNNERS_CONF.config.docs;
//     },
//     { testPath, start },
//   );
// }

async function tryCatch(fn, { testPath, start, cfg }) {
  try {
    return await fn();
  } catch (err) {
    if (err.command === 'verb') {
      const errMsg = err.all
        .split('\n')
        .filter((line) => !/\[.+].+/.test(line))
        .join('\n');
      const msg = errMsg.replace(
        /(.*)Error:\s+(.+)/,
        '$1Error: Failure in `verb`, $2',
      );

      return createFailed({ err, testPath, start, cfg }, msg);
    }

    return createFailed({ err, testPath, start, cfg });
  }
}

function createFailed({ err, testPath, start, cfg }, message) {
  const msg =
    cfg && cfg.verbose
      ? message || err.stack || err.message
      : message || 'Some unknown error!';

  return {
    hasError: true,
    error: fail({
      start,
      end: new Date(),
      test: {
        path: testPath,
        title: 'Docks',
        errorMessage: `jest-runner-docs: ${err.stack}`,
      },
    }),
  };
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
