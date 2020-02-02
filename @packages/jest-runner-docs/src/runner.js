'use strict';

/* eslint-disable max-statements */
const fs = require('fs');
const path = require('path');

const { pass, fail, skip } = require('@tunnckocore/create-jest-runner');
const { isMonorepo } = require('@tunnckocore/utils');
const { cosmiconfig } = require('cosmiconfig');
const memoizeFS = require('@tunnckocore/memoize-fs');
const findPkg = require('find-pkg');

const docks = require('./docks.js');

const memoizeCachePath = path.join('.cache', 'docs-runner-memoized');
const mem = memoizeFS({ cachePath: memoizeCachePath });
const jestRunnerConfig = cosmiconfig('jest-runner');

function memoize(func, opts) {
  return async (...args) => {
    const fn = process.env.DOCS_RELOAD ? func : await mem.fn(func, opts);
    const res = await fn(...args);
    return res;
  };
}

process.env.NODE_ENV = 'docs';

module.exports = async function jestRunnerDocs({ testPath, config }) {
  const start = new Date();

  const loadConfig = tryLoadConfig(testPath, start);
  const cfgFunc = await memoize(loadConfig, {
    cacheId: 'load-config',
    astBody: true,
    salt: 'cfg',
  });
  const conf = (await cfgFunc()) || {};

  if (conf.hasError) return conf.error;

  const docksConfig = {
    promo: true,
    flat: true,
    verbose: true,
    force: true,
    apiHeader: false, // default `false`
    outfile: '.verb.md',
    ...conf,
  };
  docksConfig.outfile = docksConfig.outfile || docksConfig.outFile;
  docksConfig.fileHeading = docksConfig.flat !== true;

  /** Find correct root path */
  function getPkgRoot() {
    return isMonorepo(config.cwd)
      ? path.dirname(findPkg.sync(path.dirname(testPath)))
      : config.rootDir;
  }

  // const pkgRoot = await memoize(getPkgRoot)();
  const pkgRoot = getPkgRoot();

  docksConfig.pkgRoot = pkgRoot;

  const testPathContents = fs.readFileSync(testPath, 'utf-8');
  let apidocsContent = null;

  const outfile = await tryCatch(
    () => {
      const resDocs = docks(testPath, docksConfig);
      apidocsContent = resDocs.contents;

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

      const relPath = path.relative(pkgRoot, testPath);
      const oldBasename = path.basename(relPath, path.extname(relPath));
      const mdBasename = `${oldBasename}.md`;
      const relDocsPath = path.join('docs', path.dirname(relPath), mdBasename);
      const outputFile = path.join(pkgRoot, relDocsPath);

      const promo = docksConfig.promo
        ? `_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._`
        : '';

      const header = docksConfig.fileHeading ? `\n\n### ${relPath}` : '';
      const docksStart = '<!-- docks-start -->';
      const docksEnd = '<!-- docks-end -->';
      const cont =
        apidocsContent.length > 0
          ? `${header}\n\n${promo}\n\n${apidocsContent.trim()}\n\n`
          : '\n';

      fs.mkdirSync(path.dirname(outputFile), { recursive: true });
      fs.writeFileSync(outputFile, cont);

      const pkgVerbMd = path.join(pkgRoot, docksConfig.outfile);
      if (fs.existsSync(pkgVerbMd)) {
        const fileContents = fs.readFileSync(pkgVerbMd, 'utf8');
        if (
          fileContents.includes(docksStart) &&
          fileContents.includes(docksEnd)
        ) {
          const idxStart = fileContents.indexOf(docksStart) + docksStart.length;
          const idxEnd = fileContents.indexOf(docksEnd);
          const oldApiContents = fileContents.slice(idxStart, idxEnd).trim();
          const newContents = `\n{%= include(process.cwd() + ${JSON.stringify(
            `/${relDocsPath}`,
          )}) %}\n`;

          if (!oldApiContents.includes(newContents.trim())) {
            const beforeApi = fileContents.slice(0, idxStart);
            const api = `\n\n${oldApiContents}${newContents}\n`;
            const afterApi = fileContents.slice(idxEnd);

            fs.writeFileSync(pkgVerbMd, `${beforeApi}${api}${afterApi}`);
          }
        }
      } else {
        fs.writeFileSync(pkgVerbMd, `${docksStart}\n${docksEnd}\n`);
      }

      return outputFile;
    },
    { testPath, start, cfg: docksConfig },
  );

  if (outfile.hasError) return outfile.error;
  if (outfile.skip) return outfile.skip;

  const postHook =
    typeof docksConfig.postHook === 'function'
      ? docksConfig.postHook
      : () => {};

  async function postHookFunc(fp, contents) {
    await postHook({
      pkgRoot,
      jestConfig: config,
      docksConfig,
      outfile,
      outFile: outfile,
      testPath: fp,
      contents,
    });

    return { fp, docksConfig, apidocsContent, contents };
  }

  const res = await tryCatch(
    async () => {
      const hookMemoized = await memoize(postHookFunc, {
        cacheId: 'posthook',
        astBody: true,
        salt: 'yep',
      });
      await hookMemoized(testPath, testPathContents);
    },
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

function tryLoadConfig(testPath, start) {
  return () =>
    tryCatch(
      async () => {
        const cfg = await jestRunnerConfig.search();

        if (!cfg || (cfg && !cfg.config)) {
          return {};
        }
        return cfg.config.docks || cfg.config.docs;
      },
      { testPath, start },
    );
}

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
        errorMessage: `jest-runner-docs: ${msg}`,
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
