const path = require('path');
const { getWorkspacesAndExtensions, createAliases } = require('../src/index');

test('get extensions and workspaces - no workspaces', () => {
  const cwd = path.dirname(__dirname);

  const result = getWorkspacesAndExtensions(cwd);
  expect(result).toMatchSnapshot();
});

test('getWorkspacesAndExtensions - correct workspaces', () => {
  const cwd = path.join(__dirname, 'fixtures', 'lerna');

  const result = getWorkspacesAndExtensions(cwd);

  expect(result).toMatchSnapshot();
});

test('createAliases return empty alias object', () => {
  const cwd = path.dirname(__dirname);
  const result = createAliases(cwd);

  expect(result).toStrictEqual({
    alias: {},
    cwd,
    extensions: [],
    exts: [],
    workspaces: [],
  });
});

test('createAliases return correct aliases', () => {
  const cwd = path.join(__dirname, 'fixtures', 'yarn-workspaces');
  const result = createAliases(cwd);

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const toAliases = (src) =>
    ['@hela/foo2', '@tunnckocore/qux'].reduce((acc, name) => {
      acc[name] = path.join(cwd, name, src);
      return acc;
    }, {});

  // // ! todo

  expect(result).toStrictEqual({
    alias: toAliases(''),
    cwd,
    extensions: ['.ts', '.tsx', '.js', '.json', '.node', '.mjs', '.jsx'],
    exts: ['ts', 'tsx', 'js', 'json', 'node', 'mjs', 'jsx'],
    workspaces: ['@tunnckocore', '@hela'],
  });

  const res = createAliases(cwd, 'source');
  expect(res).toStrictEqual({
    alias: toAliases('source'),
    cwd,
    extensions: ['.ts', '.tsx', '.js', '.json', '.node', '.mjs', '.jsx'],
    exts: ['ts', 'tsx', 'js', 'json', 'node', 'mjs', 'jsx'],
    workspaces: ['@tunnckocore', '@hela'],
  });
});
