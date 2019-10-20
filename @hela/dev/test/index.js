const mod = require('../src');

test('should export commands build, bundle, docs, lint, test', async () => {
  expect(typeof mod).toStrictEqual('object');
  expect(typeof mod.build).toStrictEqual('function');
  expect(typeof mod.bundle).toStrictEqual('function');
  expect(typeof mod.docs).toStrictEqual('function');
  expect(typeof mod.lint).toStrictEqual('function');
  expect(typeof mod.test).toStrictEqual('function');
});
