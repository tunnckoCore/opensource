import {
  build,
  bundle,
  docs,
  lint,
  test as testCmd,
  runAll,
} from '../src/index.js';

test('command: build', async () => {
  expect(typeof build).toStrictEqual('function');
});

test('command: bundle', async () => {
  expect(typeof bundle).toStrictEqual('function');
});

test('command: docs', async () => {
  expect(typeof docs).toStrictEqual('function');
});

test('command: lint', async () => {
  expect(typeof lint).toStrictEqual('function');
});

test('command: test', async () => {
  expect(typeof testCmd).toStrictEqual('function');
});

test('command: runAll', async () => {
  expect(typeof runAll).toStrictEqual('function');
});
