import runner from '../src/runner';

test('todo runner babel testing', () => {
  expect(typeof runner).toStrictEqual('function');
});
