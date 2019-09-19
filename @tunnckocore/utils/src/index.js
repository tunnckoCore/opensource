const fs = require('fs');
const path = require('path');
const Module = require('module');

// eslint-disable-next-line no-underscore-dangle
const EXTENSIONS = Object.keys(Module._extensions).filter(
  (x) => x !== '.json' && x !== '.node',
);

module.exports = { createAliases, getWorkspacesAndExtensions, isMonorepo };

function isMonorepo(cwd = process.cwd()) {
  const { workspaces } = getWorkspacesAndExtensions(cwd);

  return workspaces.length > 0;
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
function createAliases(cwd = process.cwd(), sourceDirectory) {
  // const { workspaces, extensions, exts } = getWorkspacesAndExtensions(cwd);
  const result = getWorkspacesAndExtensions(cwd);

  const alias = result.workspaces
    .filter(Boolean)
    .reduce((acc, ws) => {
      const workspace = path.join(cwd, ws);

      const packages = fs
        .readdirSync(workspace)
        .filter((x) => !result.workspaces.find((z) => z.endsWith(x)))
        .map((directory) => {
          // console.log(workspace);
          const pkgDirectory = path.join(workspace, directory);
          const pkgJsonPath = path.join(pkgDirectory, 'package.json');

          return { pkgDirectory, pkgJsonPath };
        })
        .map(({ pkgDirectory, pkgJsonPath }) => {
          // package specific package.json
          const packageJson = parseJson(pkgJsonPath, 'utf8');

          /* istanbul ignore next */
          if (Object.keys(packageJson).length === 0) {
            return null;
            // throw new Error(
            //   `Cannot find package.json or cannot parse it: ${pkgJsonPath}`,
            // );
          }
          return [pkgDirectory, packageJson];
        });

      return acc.concat(packages).filter(Boolean);
    }, [])
    .filter(Boolean)
    .reduce((acc, [pkgDirectory, packageJson]) => {
      if (typeof sourceDirectory === 'string') {
        acc[packageJson.name] = path.join(pkgDirectory, sourceDirectory);
      } else {
        const source = path.join(pkgDirectory, 'src');
        acc[packageJson.name] = fs.existsSync(source) ? source : pkgDirectory;
      }
      return acc;
    }, {});

  return { ...result, alias };
}

function parseJson(fp) {
  return fs.existsSync(fp) ? JSON.parse(fs.readFileSync(fp, 'utf8')) : {};
}

function getWorkspacesAndExtensions(cwd = process.cwd()) {
  const fromRoot = (...x) => path.resolve(cwd, ...x);
  const packageJsonPath = fromRoot('package.json');
  const lernaJsonPath = fromRoot('lerna.json');
  const packageJson = parseJson(packageJsonPath);
  const lernaJson = parseJson(lernaJsonPath);

  const workspaces = []
    .concat(lernaJson.packages || (packageJson.workspaces || []))
    .filter((x) => typeof x === 'string')
    .filter(Boolean)
    .reduce((acc, ws) => acc.concat(ws.split(',')), [])
    .map((ws) => path.dirname(ws));
  // console.log('workspaces', workspaces);
  let exts = [].concat(packageJson.extensions).filter(Boolean);

  if (exts.length === 0) {
    exts = ['tsx', 'ts', 'jsx', ...EXTENSIONS];
  }
  exts = exts.map((extension) =>
    extension.startsWith('.') ? extension.slice(1) : extension,
  );

  const extensions = exts.map((x) => `.${x}`);

  const fpath = [lernaJsonPath, packageJsonPath].find((x) => fs.existsSync(x));
  const packageRootPath = fpath ? path.dirname(fpath) : null;

  return {
    workspaces,
    extensions,
    exts,
    lernaJson,
    lernaJsonPath,
    packageJson,
    packageJsonPath,
    packageRootPath,
  };
}
