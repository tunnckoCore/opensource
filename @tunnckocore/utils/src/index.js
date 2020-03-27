const fs = require('fs');
const path = require('path');
const Module = require('module');
const cheerio = require('cheerio');

// eslint-disable-next-line no-underscore-dangle
const EXTENSIONS = Object.keys(Module._extensions).filter(
  (x) => x !== '.json' && x !== '.node',
);

module.exports = {
  createAliases,
  getWorkspacesAndExtensions,
  isMonorepo,
  testCoverage,
  coverageColor,
  tsconfigResolver,
  EXTENSIONS,
};

// we cannot test it because we are in monorepo where the cwd is.
/* istanbul ignore next */
function isMonorepo(cwd = process.cwd()) {
  return getWorkspacesAndExtensions(cwd).isMonorepo;
}

/**
 * Create explicit alias key/value pair from the current
 * packages inside each workspace, because
 *
 * '^(.+)': '/path/to/package/src'
 *
 * can be very big mistake ;]
 * We just don't use regex, we precompute them.
 */
function createAliases(cwd, sourceDirectory) {
  /* istanbul ignore next */
  const CWD = cwd || process.cwd();
  const result = getWorkspacesAndExtensions(CWD);

  const info = {};
  const alias = result.workspaces
    .filter(Boolean)
    .reduce((acc, ws) => {
      const workspace = path.join(CWD, ws);

      const packages = fs
        .readdirSync(workspace)
        .filter((x) => !result.workspaces.find((z) => z.endsWith(x)))
        .map((directory) => {
          const pkgDirectory = path.join(workspace, directory);
          const pkgJsonPath = path.join(pkgDirectory, 'package.json');

          return { pkgDirectory, pkgJsonPath, directory };
        })
        .map(({ pkgDirectory, pkgJsonPath, directory }) => {
          // package specific package.json
          const packageJson = parseJson(pkgJsonPath, 'utf8');

          /* istanbul ignore next */
          if (Object.keys(packageJson).length === 0) {
            return null;
            // skip silently
            // throw new Error(
            //   `Cannot find package.json or cannot parse it: ${pkgJsonPath}`,
            // );
          }
          const workspaceName = ws;
          const packageFolder = directory;

          return { pkgDirectory, packageJson, workspaceName, packageFolder };
        });

      return acc.concat(packages).filter(Boolean);
    }, [])
    .filter(Boolean)
    .reduce(
      (acc, { pkgDirectory, packageJson, workspaceName, packageFolder }) => {
        const name = path.join(workspaceName, packageFolder);
        if (sourceDirectory && typeof sourceDirectory === 'string') {
          acc[packageJson.name] = path.join(pkgDirectory, sourceDirectory);
          info[packageJson.name] = path.dirname(acc[packageJson.name]);
          info[name] = path.dirname(acc[packageJson.name]);
        } else {
          const source = path.join(pkgDirectory, 'src');

          if (fs.existsSync(source)) {
            acc[packageJson.name] = source;
            info[packageJson.name] = path.dirname(acc[packageJson.name]);
            info[name] = path.dirname(acc[packageJson.name]);
          } else {
            acc[packageJson.name] = pkgDirectory;
            info[packageJson.name] = pkgDirectory;
            info[name] = path.dirname(acc[packageJson.name]);
          }
        }
        return acc;
      },
      {},
    );

  return { ...result, alias, info };
}

function parseJson(fp) {
  if (fs.existsSync(fp)) {
    let res = {};
    try {
      res = JSON.parse(fs.readFileSync(fp, 'utf8'));
    } catch (err) {}
    return res;
  }

  return {};
}

function getWorkspacesAndExtensions(rootDir) {
  /* istanbul ignore next */
  const cwd = rootDir || process.cwd();
  const fromRoot = (...x) => path.resolve(cwd, ...x);
  const packageJsonPath = fromRoot('package.json');
  const lernaJsonPath = fromRoot('lerna.json');
  const packageJson = parseJson(packageJsonPath);
  const lernaJson = parseJson(lernaJsonPath);

  /* istanbul ignore next */
  const yarnWorkspaces = Array.isArray(packageJson.workspaces)
    ? packageJson.workspaces
    : packageJson.workspaces && packageJson.workspaces.packages;

  const workspaces = []
    .concat(lernaJson.packages || yarnWorkspaces || [])
    .filter((x) => typeof x === 'string')
    .filter(Boolean)
    .reduce((acc, ws) => acc.concat(ws.split(',')), [])
    .map((ws) => path.dirname(ws));

  let exts = [].concat(packageJson.extensions).filter(Boolean);

  if (exts.length === 0) {
    exts = ['tsx', 'ts', 'jsx', ...EXTENSIONS];
  }
  exts = exts.map((extension) =>
    extension.startsWith('.') ? extension.slice(1) : extension,
  );

  const extensions = exts.map((x) => `.${x}`);

  const fpath = [lernaJsonPath, packageJsonPath].find((x) => fs.existsSync(x));
  const workspaceRootPath = fpath ? path.dirname(fpath) : null;

  return {
    workspaces,
    extensions,
    exts,
    lernaJson,
    lernaJsonPath,
    packageJson,
    packageJsonPath,
    workspaceRootPath,
    fromRoot,
    cwd,
    isMonorepo: workspaces.length > 0,
  };
}

function testCoverage(rootDir, testCovPath) {
  const {
    packageJsonPath,
    packageJson: pkg,
    isMonorepo: isMono,
    fromRoot,
    cwd,
  } = getWorkspacesAndExtensions(rootDir);

  // const monoRoot = path.basename(path.dirname(packageJsonPath));

  if (!isMono) {
    throw new Error('This should only be used in monorepo environments.');
  }

  const lcovReportPath =
    typeof testCovPath === 'string'
      ? fromRoot(testCovPath)
      : fromRoot('coverage', 'lcov-report', 'index.html');

  const LCOV_REPORT = fromRoot(lcovReportPath);

  if (!fs.existsSync(LCOV_REPORT)) {
    const file = path.relative(cwd, LCOV_REPORT);
    throw new Error(
      `Run tests with coverage. Missing coverage report ./${file}!`,
    );
  }

  const lcovInfo = fs.readFileSync(LCOV_REPORT, 'utf8');
  const $ = cheerio.load(lcovInfo);

  const files = {};
  const monoRoot = path.basename(path.dirname(packageJsonPath));

  $('tr').each(function sasa(i, item) {
    const filepath = $('.file', item).text();
    const [statements, branches, functions, lines] = $('.pct', item)
      .text()
      .split('%');

    if (filepath === 'File') {
      return;
    }

    files[filepath] = {
      statements: Number(statements),
      branches: Number(branches),
      functions: Number(functions),
      lines: Number(lines),
    };
  });

  const jestCov = Object.keys(files)
    .filter((x) => x !== monoRoot)
    .reduce((acc, file) => {
      let value = files[file];

      const [monoDir, ws, folderName] = file.split('/');

      const pkgRoot = path.join(monoDir, ws, folderName);

      const res = Object.keys(files)
        .filter((key) => key.startsWith(pkgRoot))
        .map((filename) => files[filename]);

      if (res.length > 1) {
        value = res.reduce(
          (accumulator, item) => {
            accumulator.statements += item.statements / res.length;
            accumulator.branches += item.branches / res.length;
            accumulator.functions += item.functions / res.length;
            accumulator.lines += item.lines / res.length;

            return accumulator;
          },
          { statements: 0, branches: 0, functions: 0, lines: 0 },
        );
      }

      const cov = Object.keys(value).reduce(
        (accum, typeName) => accum + value[typeName],
        0,
      );

      const coverage = Number((cov / 4).toFixed(2));

      acc[pkgRoot] = {
        value: coverage,
        color: coverageColor(coverage),
      };
      return acc;
    }, {});

  return {
    packageJsonPath,
    pkg: {
      ...pkg,
      cov: Object.keys(jestCov).reduce((acc, k) => {
        // const newKey = k
        //   .split('/')
        //   .slice(1)
        //   .join('/');

        /* istanbul ignore next */
        const newKey = k.endsWith('src')
          ? k.split('/').slice(0, -1).join('/')
          : k;

        acc[newKey] = jestCov[k];
        return acc;
      }, {}),
    },
    message: `Done. Now you have \`cov\` field in the root package.json!\nYou can use it to further generate per package badges.`,
  };

  // fs.writeFileSync(packageJsonPath, JSON.stringify({ ...pkg, jestCov }, 0, 2));
  // console.log('Done. Now you have `jestCov` field in the root package.json!');
  // console.log('You can use it to further generate per package badges.');
}

function coverageColor(value, colors = {}) {
  const defaultColors = { green: 100, yellow: 85, orange: 70, red: 35 };
  const { red, orange, yellow, green } = { ...defaultColors, ...colors };

  if (!value) {
    return 'grey';
  }
  if (value < red) {
    return 'red';
  }
  if (value < orange) {
    return 'orange';
  }
  if (value < yellow) {
    return 'EEAA22';
  }
  if (value < green) {
    return '99CC09';
  }
  return 'green';
}

// todo: testing
/* istanbul ignore next */
function tsconfigResolver(rootDir) {
  const cwd = rootDir || process.cwd();
  const { isMonorepo: isMono, workspaces } = getWorkspacesAndExtensions(cwd);
  const TSCONFIG_ESLINT = path.join(cwd, 'tsconfig.eslint.json');
  const TSCONFIG = path.join(cwd, 'tsconfig.json');
  const project = [TSCONFIG_ESLINT, TSCONFIG].find((x) => fs.existsSync(x));

  return isMono
    ? [project].concat(
        workspaces.reduce(
          (acc, ws) => acc.concat(path.join(cwd, ws, '*', 'tsconfig.json')),
          [],
        ),
      )
    : project;
}
