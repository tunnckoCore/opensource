function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const fs = require('fs');

const path = require('path');

const Module = require('module');

const EXTENSIONS = Object.keys(Module._extensions).filter(x => x !== '.json' && x !== '.node');
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
  const result = getWorkspacesAndExtensions(cwd);
  const alias = result.workspaces.filter(Boolean).reduce((acc, ws) => {
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
      const packageJson = parseJson(pkgJsonPath, 'utf8');

      if (Object.keys(packageJson).length === 0) {
        throw new Error(`Cannot find package.json or cannot parse it: ${pkgJsonPath}`);
      }

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
  return _objectSpread({}, result, {
    alias
  });
}

function parseJson(fp) {
  return fs.existsSync(fp) ? JSON.parse(fs.readFileSync(fp, 'utf8')) : {};
}

function getWorkspacesAndExtensions(cwd = process.cwd()) {
  const fromRoot = (...x) => path.resolve(cwd, ...x);

  const packagePath = fromRoot('package.json');
  const lernaPath = fromRoot('lerna.json');
  const pkg = parseJson(packagePath);
  const lerna = parseJson(lernaPath);
  const workspaces = [].concat(lerna.packages || pkg.workspaces || []).filter(x => typeof x === 'string').filter(Boolean).reduce((acc, ws) => acc.concat(ws.split(',')), []).map(ws => path.dirname(ws));
  let exts = [].concat(pkg.extensions).filter(Boolean);

  if (exts.length === 0) {
    exts = ['tsx', 'ts', 'jsx', ...EXTENSIONS];
  }

  exts = exts.map(extension => extension.startsWith('.') ? extension.slice(1) : extension);
  const extensions = exts.map(x => `.${x}`);
  return {
    workspaces,
    extensions,
    exts,
    lerna,
    lernaPath,
    pkg,
    packagePath
  };
}