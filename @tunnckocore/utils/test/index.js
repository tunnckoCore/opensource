'use strict';

const os = require('os');
const path = require('path');

const {
  isMonorepo,
  getWorkspacesAndExtensions,
  createAliases,
} = require('../src');

expect.extend({
  toHaveMatchingParts(received, ...value) {
    const SEP = os.platform() === 'win32' ? path.win32.sep : path.sep;
    console.log({ SEP, val: value.join(SEP) });
    const pass = received.endsWith(value.join(SEP));

    if (pass) {
      return {
        message: () => `expected ${received} not to ends with ${value}`,
        pass: true,
      };
    }
    return {
      message: () => `expected ${received} to ends with ${value}`,
      pass: false,
    };
  },
  toContainEvery(received, items) {
    const pass = items.every((name) => received.includes(name));

    if (pass) {
      return {
        message: () => `expected ${received} not to include every of ${items}`,
        pass: true,
      };
    }
    return {
      message: () => `expected ${received} to be include every of ${items}`,
      pass: false,
    };
  },
});

test('get extensions and workspaces - no workspaces', () => {
  const rootDir = path.dirname(__dirname);
  const result = getWorkspacesAndExtensions(rootDir);

  expect(result.workspaces).toStrictEqual([]);
  expect(result.lernaJson).toStrictEqual({});
  expect(result.exts).toContainEvery(['tsx', 'ts', 'jsx', 'js']);
  expect(result.extensions).toContainEvery(['.tsx', '.ts', '.jsx', '.js']);
});

test('getWorkspacesAndExtensions - correct workspaces', () => {
  const rootDir = path.join(__dirname, 'fixtures', 'lerna');

  const result = getWorkspacesAndExtensions(rootDir);

  expect(result.workspaces).toStrictEqual(['@tunnckocore', 'packages']);
  expect(result.extensions).toStrictEqual(['.js', '.jsx', '.ts']);
  expect(result.exts).toStrictEqual(['js', 'jsx', 'ts']);
  expect(result.lernaJson).toStrictEqual({
    packages: ['@tunnckocore/*', 'packages/*'],
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

  expect(result.workspaceRootPath).toStrictEqual(null);
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
  const res = createAliases(lernaRoot, 'source');

  /**
   * The scenario is that we have package named `@helios/qux` inside `packages/foo`
   * and that's the correct result of `alias`.
   * The key is the package name the value is path to source directory, not its root.
   * {
   *  '@tunnckocore/barry': '/home/charlike//fixtures/lerna/@tunnckocore/barry/source',
   *  '@helios/qux': '/home/charlike/fixtures/lerna/packages/foo/source',
   *   numb: '/home/charlike/fixtures/lerna/packages/numb/source'
   * }
   */

  expect(Object.keys(res.alias)).toStrictEqual([
    '@tunnckocore/barry',
    '@helios/qux',
    'numb',
  ]);

  expect(res.alias['@tunnckocore/barry']).toHaveMatchingParts(
    '@tunnckocore',
    'barry',
    'source',
  );

  expect(res.alias['@helios/qux']).toHaveMatchingParts(
    'packages',
    'foo',
    'source',
  );
  expect(res.alias.numb).toHaveMatchingParts('packages', 'numb', 'source');

  const bases = Object.values(res.alias).map((filepath) =>
    filepath
      .split('/')
      .slice(-3)
      .join('/'),
  );

  // These are the real actual directories of above packages
  expect(bases).toStrictEqual([
    '@tunnckocore/barry/source',
    'packages/foo/source',
    'packages/numb/source',
  ]);
  expect(res.lernaJson).toStrictEqual({
    packages: ['@tunnckocore/*', 'packages/*'],
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

test('isMonorepo - false, regular repository', () => {
  expect(isMonorepo(path.dirname(__dirname))).toStrictEqual(false);

  // we cannot test it, because we are in monorepo where the cwd is.
  // expect(isMonorepo()).toStrictEqual(false);
});

test('correct *Path properties when Lerna monorepo', () => {
  const lernaRoot = path.join(__dirname, 'fixtures', 'lerna');
  const result = createAliases(lernaRoot);

  expect(typeof result.lernaJsonPath).toStrictEqual('string');
  expect(typeof result.packageJsonPath).toStrictEqual('string');
  expect(typeof result.workspaceRootPath).toStrictEqual('string');

  expect(path.dirname(result.lernaJsonPath)).toStrictEqual(
    result.workspaceRootPath,
  );

  expect(result.packageJson).toBeTruthy();
  expect(typeof result.packageJson).toStrictEqual('object');
});

test('correct *Path properties when Yarn Workspaces monorepo', () => {
  const yarnWorkspaces = path.join(__dirname, 'fixtures', 'yarn-workspaces');
  const result = createAliases(yarnWorkspaces);

  expect(typeof result.lernaJsonPath).toStrictEqual('string');
  expect(typeof result.packageJsonPath).toStrictEqual('string');
  expect(typeof result.workspaceRootPath).toStrictEqual('string');

  expect(path.dirname(result.packageJsonPath)).toStrictEqual(
    result.workspaceRootPath,
  );

  expect(result.packageJson).toBeTruthy();
  expect(typeof result.packageJson).toStrictEqual('object');
});
