import runner from '../src/runner';

test('todo jest-runner-eslint tests', () => {
  expect(typeof runner).toStrictEqual('function');
});
