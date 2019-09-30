import mod from '../src';

test('make tests for rdj package', async () => {
  expect(typeof mod).toStrictEqual('function');
  mod();
});
