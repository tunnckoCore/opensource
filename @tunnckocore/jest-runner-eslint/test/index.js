import runner from '../src';

test('todo jest-runner-eslint tests', () => {
  expect(typeof runner).toStrictEqual('function');
});
