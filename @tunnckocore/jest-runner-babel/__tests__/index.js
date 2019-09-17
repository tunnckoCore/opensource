const runner = require('../src/index');

test('get extensions and workspaces - no workspaces', () => {
  expect(typeof runner).toStrictEqual('function');
});
