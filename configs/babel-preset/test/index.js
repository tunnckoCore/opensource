const path = require('path');
const { transformSync } = require('@babel/core');
const config = require('../src/index.js');

process.env.SELF_TEST_TUNNCKOCORE = 'yes';

test('config/preset to be a function', async () => {
  expect(typeof config).toStrictEqual('function');
});

test('to throw error when typescript: false', async () => {
  const opts = { typescript: false, presetEnv: false };
  const inputCode = `export const bar = (foo: number, bar: number) => {};`;

  const fn = () =>
    transformSync(inputCode, {
      babelrc: false,
      filename: 'fixture-foo.ts',
      presets: [[path.join(path.dirname(__dirname), 'src', 'index.js'), opts]],
    });

  expect(fn).toThrow(SyntaxError);
  expect(fn).toThrow(/Unexpected token, expected/);
});

test('to transform typescript properly', () => {
  const opts = { typescript: true, presetEnv: false };
  const inputCode = `export const bar = (foo: number, bar: number) => {};`;

  const res = transformSync(inputCode, {
    babelrc: false,
    filename: 'fixture-bar.ts',
    presets: [[path.join(path.dirname(__dirname), 'src', 'index.js'), opts]],
  });
  expect(res.code).toStrictEqual('export const bar = (foo, bar) => {};');
});
