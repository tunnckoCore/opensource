const fs = require('fs');

const path = require('path');

const Module = require('module');

const EXTENSIONS = Object.keys(Module._extensions).concat('.jsx');
module.exports = {
  createAliases,
  getWorkspacesAndExtensions,
  isMonorepo
};

function isMonorepo(cwd = process.cwd()) {
  const {
    workspaces
  } = getWorkspacesAndExtensions(cwd);
  return workspaces.length > 0;
}

function createAliases(cwd = process.cwd(), sourceDirectory) {
  const {
    workspaces,
    extensions,
    exts
  } = getWorkspacesAndExtensions(cwd);
  const alias = workspaces.filter(Boolean).reduce((acc, ws) => {
    const workspace = path.join(cwd, ws);
    const packages = fs.readdirSync(workspace).map(directory => {
      const pkgDirectory = path.join(workspace, directory);
      const pkgJsonPath = path.join(pkgDirectory, 'package.json');
      return {
        pkgDirectory,
        pkgJsonPath
      };
    }).map(({
      pkgDirectory,
      pkgJsonPath
    }) => {
      const packageJson = require(pkgJsonPath);

      return [pkgDirectory, packageJson];
    });
    return acc.concat(packages);
  }, []).reduce((acc, [pkgDirectory, packageJson]) => {
    if (typeof sourceDirectory === 'string') {
      acc[packageJson.name] = path.join(pkgDirectory, sourceDirectory);
    } else {
      const source = path.join(pkgDirectory, 'src');
      acc[packageJson.name] = fs.existsSync(source) ? source : pkgDirectory;
    }

    return acc;
  }, {});
  return {
    cwd,
    extensions,
    exts,
    alias,
    workspaces
  };
}

function getWorkspacesAndExtensions(cwd = process.cwd()) {
  const fromRoot = (...x) => path.resolve(cwd, ...x);

  const rootPackage = require(fromRoot('package.json'));

  const rootLerna = fs.existsSync(fromRoot('lerna.json')) ? require(fromRoot('lerna.json')) : {};
  const workspaces = [].concat(rootLerna.packages || rootPackage.workspaces || []).filter(x => typeof x === 'string').filter(Boolean).reduce((acc, ws) => acc.concat(ws.split(',')), []).map(ws => path.dirname(ws));
  let exts = [].concat(rootPackage.extensions).filter(Boolean);

  if (exts.length === 0) {
    exts = ['ts', 'tsx', ...EXTENSIONS];
  }

  exts = exts.map(extension => extension.startsWith('.') ? extension.slice(1) : extension);
  const extensions = exts.map(x => `.${x}`);
  return {
    workspaces,
    extensions,
    exts
  };
}