const runner = require('../src/index');

test('todo', () => {
  expect(typeof runner).toStrictEqual('function');
});
