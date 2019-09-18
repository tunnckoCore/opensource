'use strict';

const path = require('path');
const { isMonorepo, getWorkspacesAndExtensions, createAliases } = require('..');

test('get extensions and workspaces - no workspaces', () => {
  const rootDir = path.dirname(__dirname);
  const result = getWorkspacesAndExtensions(rootDir);

  expect(result.workspaces).toStrictEqual([]);
  expect(result.lerna).toStrictEqual({});
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
  expect(result.lerna).toStrictEqual({
    packages: ['@tunnckocore/*', '@helios/*'],
  });
  expect(result.pkg).toStrictEqual({
    name: 'lerna-monorepo',
    extensions: result.exts,
  });
});

test('createAliases return empty alias object', () => {
  const cwd = path.dirname(path.dirname(__dirname));
  const result = createAliases(cwd);

  expect(result.alias).toStrictEqual({});
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
  expect(result.lerna).toStrictEqual({});
  expect(result.exts).toStrictEqual(['js', 'ts']);
  expect(result.pkg).toStrictEqual({
    extensions: result.exts,
    workspaces: ['@tunnckocore/*', '@hela/*'],
  });
  expect(result.lernaPath).toStrictEqual(path.join(yarnRoot, 'lerna.json'));
  expect(result.packagePath).toStrictEqual(path.join(yarnRoot, 'package.json'));
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
  expect(res.lerna).toStrictEqual({
    packages: ['@tunnckocore/*', '@helios/*'],
  });
  expect(res.exts).toStrictEqual(['js', 'jsx', 'ts']);
  expect(res.pkg).toStrictEqual({
    name: 'lerna-monorepo',
    extensions: ['js', 'jsx', 'ts'],
  });
  expect(res.lernaPath).toStrictEqual(path.join(lernaRoot, 'lerna.json'));
  expect(res.packagePath).toStrictEqual(path.join(lernaRoot, 'package.json'));
});

test('isMonorepo - true for workspaces root', () => {
  const lernaRepo = path.join(__dirname, 'fixtures', 'lerna');
  expect(isMonorepo(lernaRepo)).toStrictEqual(true);
});

test('isMonorepo - false regular repository', () => {
  expect(isMonorepo(path.dirname(__dirname))).toStrictEqual(false);
});
