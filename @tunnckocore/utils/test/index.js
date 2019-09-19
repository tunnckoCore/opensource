'use strict';

const path = require('path');
const {
  isMonorepo,
  getWorkspacesAndExtensions,
  createAliases,
} = require('../src');

test('get extensions and workspaces - no workspaces', () => {
  const rootDir = path.dirname(__dirname);
  const result = getWorkspacesAndExtensions(rootDir);

  expect(result.workspaces).toStrictEqual([]);
  expect(result.lernaJson).toStrictEqual({});
  expect(result.exts).toStrictEqual(['tsx', 'ts', 'jsx', 'js', 'mjs']);
  expect(result.extensions).toStrictEqual([
    '.tsx',
    '.ts',
    '.jsx',
    '.js',
    '.mjs',
  ]);
});

test('getWorkspacesAndExtensions - correct workspaces', () => {
  const rootDir = path.join(__dirname, 'fixtures', 'lerna');

  const result = getWorkspacesAndExtensions(rootDir);

  expect(result.workspaces).toStrictEqual(['@tunnckocore', '@helios']);
  expect(result.extensions).toStrictEqual(['.js', '.jsx', '.ts']);
  expect(result.exts).toStrictEqual(['js', 'jsx', 'ts']);
  expect(result.lernaJson).toStrictEqual({
    packages: ['@tunnckocore/*', '@helios/*'],
  });
  expect(result.packageJson).toStrictEqual({
    name: 'lerna-monorepo',
    extensions: result.exts,
  });
});

test('createAliases return empty alias object', () => {
  const cwd = path.dirname(path.dirname(__dirname));
  const result = createAliases(cwd);

  expect(result.alias).toStrictEqual({});
  expect(typeof result.packageJsonPath).toStrictEqual('string');
  expect(result.packageJsonPath.startsWith(cwd)).toStrictEqual(true);

  expect(typeof result.lernaJsonPath).toStrictEqual('string');
  expect(result.lernaJsonPath.startsWith(cwd)).toStrictEqual(true);

  expect(result.packageRootPath).toStrictEqual(null);
});

test('createAliases return correct aliases for yarn workspaces', () => {
  const yarnRoot = path.join(__dirname, 'fixtures', 'yarn-workspaces');
  const result = createAliases(yarnRoot);

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const toAliases = (src) =>
    ['@hela/fab', '@tunnckocore/qux'].reduce((acc, name) => {
      acc[name] = path.join(yarnRoot, name, src);
      return acc;
    }, {});

  expect(result.alias).toStrictEqual(toAliases('src'));
  expect(result.lernaJson).toStrictEqual({});
  expect(result.exts).toStrictEqual(['js', 'ts']);
  expect(result.packageJson).toStrictEqual({
    extensions: result.exts,
    workspaces: ['@tunnckocore/*', '@hela/*'],
  });
  expect(result.lernaJsonPath).toStrictEqual(path.join(yarnRoot, 'lerna.json'));
  expect(result.packageJsonPath).toStrictEqual(
    path.join(yarnRoot, 'package.json'),
  );
});

test('createAliases return correct aliases for Lerna workspaces', () => {
  const lernaRoot = path.join(__dirname, 'fixtures', 'lerna');
  const res = createAliases(lernaRoot);

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const toAliases = (src) =>
    ['@helios/foo', '@tunnckocore/barry'].reduce((acc, name) => {
      acc[name] = path.join(lernaRoot, name, src);
      return acc;
    }, {});

  expect(res.alias).toStrictEqual(toAliases(''));
  expect(res.lernaJson).toStrictEqual({
    packages: ['@tunnckocore/*', '@helios/*'],
  });
  expect(res.exts).toStrictEqual(['js', 'jsx', 'ts']);
  expect(res.packageJson).toStrictEqual({
    name: 'lerna-monorepo',
    extensions: ['js', 'jsx', 'ts'],
  });
  expect(res.lernaJsonPath).toStrictEqual(path.join(lernaRoot, 'lerna.json'));
  expect(res.packageJsonPath).toStrictEqual(
    path.join(lernaRoot, 'package.json'),
  );
});

test('isMonorepo - true for workspaces root', () => {
  const lernaRepo = path.join(__dirname, 'fixtures', 'lerna');
  expect(isMonorepo(lernaRepo)).toStrictEqual(true);
});

test('isMonorepo - false regular repository', () => {
  expect(isMonorepo(path.dirname(__dirname))).toStrictEqual(false);
});

test('correct *Path properties when Lerna monorepo', () => {
  const lernaRoot = path.join(__dirname, 'fixtures', 'lerna');
  const result = createAliases(lernaRoot);

  expect(typeof result.lernaJsonPath).toStrictEqual('string');
  expect(typeof result.packageJsonPath).toStrictEqual('string');
  expect(typeof result.packageRootPath).toStrictEqual('string');

  expect(path.dirname(result.lernaJsonPath)).toStrictEqual(
    result.packageRootPath,
  );

  expect(result.packageJson).toBeTruthy();
  expect(typeof result.packageJson).toStrictEqual('object');
});

test('correct *Path properties when Yarn Workspaces monorepo', () => {
  const yarnWorkspaces = path.join(__dirname, 'fixtures', 'yarn-workspaces');
  const result = createAliases(yarnWorkspaces);

  expect(typeof result.lernaJsonPath).toStrictEqual('string');
  expect(typeof result.packageJsonPath).toStrictEqual('string');
  expect(typeof result.packageRootPath).toStrictEqual('string');

  expect(path.dirname(result.packageJsonPath)).toStrictEqual(
    result.packageRootPath,
  );

  expect(result.packageJson).toBeTruthy();
  expect(typeof result.packageJson).toStrictEqual('object');
});
