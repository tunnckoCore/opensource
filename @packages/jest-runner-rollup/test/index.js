import mod from '../src/runner';

test('make tests for jest-runner-rollup package', async () => {
  expect(typeof mod).toStrictEqual('function');
});
