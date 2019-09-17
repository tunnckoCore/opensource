const path = require('path');
const { getWorkspacesAndExtensions, createAliases } = require('../src/index');

test('get extensions and workspaces - no workspaces', () => {
  const cwd = path.dirname(path.dirname(__dirname));

  const result = getWorkspacesAndExtensions(cwd);

  expect(result).toStrictEqual({
    workspaces: [],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
    exts: ['js', 'jsx', 'ts', 'tsx', 'mjs'],
  });
});

test('getWorkspacesAndExtensions - correct workspaces', () => {
  const cwd = path.join(__dirname, 'fixtures', 'lerna');

  const result = getWorkspacesAndExtensions(cwd);

  expect(result).toStrictEqual({
    workspaces: ['@tunnckocore', '@hela'],
    extensions: ['.js', '.ts'],
    exts: ['js', 'ts'],
  });
});

test('createAliases return empty alias object', () => {
  const cwd = path.dirname(path.dirname(__dirname));
  const result = createAliases(cwd);

  expect(result).toStrictEqual({
    cwd,
    alias: {},
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
    exts: ['js', 'jsx', 'ts', 'tsx', 'mjs'],
  });
});

test('createAliases return correct aliases', () => {
  const cwd = path.join(__dirname, 'fixtures', 'yarn-workspaces');
  const result = createAliases(cwd);

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const toAliases = (src) =>
    ['@hela/foo2', '@tunnckocore/barry'].reduce((acc, name) => {
      acc[name] = path.join(cwd, name, src);
      return acc;
    }, {});

  expect(result).toStrictEqual({
    cwd,
    // { '@hela/foo': 'full/file/path/to/@hela/foo/src'}
    alias: toAliases('src'),
    extensions: ['.js', '.ts'],
    exts: ['js', 'ts'],
  });

  const res = createAliases(cwd, 'source');

  expect(res).toStrictEqual({
    cwd,
    alias: toAliases('source'),
    extensions: ['.js', '.ts'],
    exts: ['js', 'ts'],
  });
});
