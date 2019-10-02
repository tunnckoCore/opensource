import fs from 'fs';
import path from 'path';
import Module from 'module';

/* eslint-disable global-require, import/no-dynamic-require, no-param-reassign */

// import mm from 'micromatch';
import builtins from 'builtin-modules';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from '@wessberg/rollup-plugin-ts';
import { getWorkspacesAndExtensions } from '@tunnckocore/utils';
import { getGlobals, normalizePkg, upperCamelCase } from 'umd-globals';

function getBasicPlugins(resolve, prod, extensions) {
  const shouldResolve = resolve || prod;

  return [
    shouldResolve &&
      nodeResolve({
        mainFields: ['esnext', 'es2015', 'esm', 'src', 'module', 'main'],
        extensions,
      }),
    commonjs(),
    json(),
  ].filter(Boolean);
}

const DEFAULT_FORMATS = ['cjs', 'esm'];

let isTsAvailable = false;

try {
  require.resolve('typescript');
  isTsAvailable = true;
  // eslint-disable-next-line no-empty
} catch (err) {}

// eslint-disable-next-line no-underscore-dangle
const EXTENSIONS = Object.keys(Module._extensions);

if (isTsAvailable) {
  EXTENSIONS.unshift('.ts', '.tsx');
}

const tryExtensions = (filepath) => {
  const hasExtension = path.extname(filepath).length > 0;

  if (hasExtension) {
    return filepath;
  }

  // if `--input foo` check `pkg-name/foo.<ext>` (e.g. the root of repo or package)
  let extension = EXTENSIONS.find((ext) => fs.existsSync(filepath + ext));

  if (!extension) {
    const dirname = path.dirname(filepath);
    const input = path.basename(filepath);
    filepath = path.join(dirname, 'src', input);

    // if `--input foo` check `pkg-name/src/foo.<ext>`
    extension = EXTENSIONS.find((x) => fs.existsSync(filepath + x));
  }

  if (!extension) {
    throw new Error(`Cannot find input file: ${filepath}`);
  }

  return filepath + extension;
};

function getAllPackages(wsDirectories) {
  return [].concat(wsDirectories).reduce((acc, ws) => {
    const pkgsInWorkspace = fs.readdirSync(ws);

    return acc.concat(pkgsInWorkspace.map((pkg) => path.join(ws, pkg)));
  }, []);
}

function configBase(options = {}) {
  const opts = {
    resolve: false,
    cwd: process.cwd(),
    outputDir: 'dist',
    input: 'src/index',
    ...options,
  };

  const { formats, cwd, monorepo, exports, externals, prod, license } = opts;
  const { workspaces } = getWorkspacesAndExtensions(opts.cwd);

  const pkgsDirs = typeof monorepo === 'string' ? monorepo : null;
  const workspacesPaths = []
    .concat(pkgsDirs || null)
    .concat(
      !pkgsDirs && typeof monorepo === 'boolean' && monorepo
        ? workspaces
        : null,
    )
    .filter(Boolean)
    .map((ws) => (fs.existsSync(path.join(opts.cwd, ws)) ? ws : null))
    .filter(Boolean);

  const isMonorepo = workspacesPaths.length > 0;

  let outDir = opts.outputDir;
  if (opts.outputDir && !opts.outputDir.endsWith('/')) {
    outDir = `${opts.outputDir}/`;
  }

  const pkgs = isMonorepo ? getAllPackages(workspacesPaths) : [''];
  // const isAbsolute = path.isAbsolute(input);

  let { globals } = opts;
  globals = typeof globals === 'string' ? JSON.parse(globals) : globals;
  globals = getGlobals({ globals });

  // console.log(opts);
  const ignores = [].concat().filter(Boolean);
  const isMatch =
    ignores.length > 0 ? () => true /* mm.matcher(ignores) */ : () => false;

  const configs = pkgs
    .map((packageWithWorkspace) => {
      const [workspaceName, packageName] = packageWithWorkspace.split('/');
      return { workspaceName, packageName };
    })
    .filter(({ packageName }) => !isMatch(packageName))
    .reduce((cfgs, { packageName, workspaceName }) => {
      // if (isMonorepo && micromatch.isMatch(pkgName, opts.ignore))
      const pkgPath = isMonorepo
        ? path.resolve(cwd, workspaceName, packageName)
        : cwd;
      const pkgInput = tryExtensions(path.join(pkgPath, opts.input));

      const pkgJson = require(path.resolve(pkgPath, 'package.json'));
      const {
        name,
        engines: { node } = {},
        dependencies = {},
        peerDependencies = {},
      } = pkgJson;

      const pkgName = name;

      const passedExternals = []
        .concat(externals)
        .filter(Boolean)
        .reduce((acc, extr) => acc.concat(extr.split(',')), []);

      const external = [].concat(passedExternals).concat(
        // if we want them to be resolved, we should not add
        // them to the `external`s array option
        opts.resolve
          ? []
          : Object.keys(peerDependencies).concat(Object.keys(dependencies)),
        node ? builtins : [],
      );

      const isTsInput = /\.tsx?/.test(pkgInput);

      if (isTsInput && !EXTENSIONS.includes('.ts')) {
        EXTENSIONS.unshift('.ts', '.tsx');
      }

      const allFormats = []
        .concat(formats)
        .filter(Boolean)
        .reduce((acc, fmt) => acc.concat(fmt.split(',')), [])
        .filter(Boolean);

      const packageFormats =
        allFormats.length > 0
          ? allFormats
          : DEFAULT_FORMATS.concat(node ? [] : 'umd');

      const pkgGlobals = external.reduce((acc, x) => {
        if (acc[x] == null) {
          const normalizedPackageName = upperCamelCase(normalizePkg(x));
          return { ...acc, [x]: normalizedPackageName };
        }
        return acc;
      }, globals);

      const notypesProjectPath = path.join(cwd, 'tsconfig.notypes.json');
      const notypesConfig = fs.existsSync(notypesProjectPath)
        ? notypesProjectPath
        : path.join(__dirname, 'tsconfig.notypes.json');

      const confs = packageFormats.map((format) => {
        const isEs = /^es(m|\d+|next)$/.test(format) && format !== 'es5';
        return {
          input: pkgInput,
          output: {
            sourcemap: true,
            preferConst: true,
            file: path.resolve(
              pkgPath,
              `${outDir}${format}/index${prod ? '.min' : ''}.js`,
            ),
            format: isEs ? 'esm' : format,
            // don't break oldschool/classic/normal node.js
            // for example, require('foo'); not require('foo').default
            banner: `/** Released under the ${license ||
              pkgJson.license} License. See LICENSE file. */`,
            outro: !isEs && 'module.exports = exports.default || exports;',
            name: pkgGlobals[pkgName] || upperCamelCase(normalizePkg(pkgName)),
            globals,
            exports,
          },
          external,
          inlineDynamicImports: true,
          experimentalTopLevelAwait: true,
          plugins: [
            isTsAvailable && isTsInput
              ? typescript(
                  // generate types bundle index.d.ts only once,
                  // and do not generate minified variant for it
                  isEs && !prod
                    ? { transpiler: 'babel' }
                    : {
                        transpiler: 'babel',
                        tsconfig: notypesConfig,
                      },
                )
              : babel({ extensions: EXTENSIONS }),
          ].concat(
            getBasicPlugins(opts.resolve, prod, EXTENSIONS),
            prod
              ? [
                  replace({
                    'process.env.NODE_ENV': '"production"',
                  }),
                  terser(),
                ]
              : [],
          ),
        };
      });

      return cfgs.concat(confs);
    }, []);

  if (configs.length === 0) {
    console.warn(
      configs.length,
      "No configuration resolved, mark sure you've setup correctly",
    );
  }

  return configs.map((x) => (Array.isArray(x) ? null : x)).filter(Boolean);
}

export default (options = {}) => configBase(options);
