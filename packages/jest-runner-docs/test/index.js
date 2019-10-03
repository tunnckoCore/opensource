import mod from '../src';

test('make tests for jest-runner-docs package', async () => {
  expect(typeof mod).toStrictEqual('function');
  mod();
});
