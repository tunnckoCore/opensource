import mod from '../src/runner';

test('make tests for jest-runner-docs package', async () => {
  expect(typeof mod).toStrictEqual('function');
});
