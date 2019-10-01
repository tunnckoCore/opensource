import mod from '../src';

test('make tests for jest-runner-rollup package', async () => {
  expect(typeof mod).toStrictEqual('function');
  mod();
});
