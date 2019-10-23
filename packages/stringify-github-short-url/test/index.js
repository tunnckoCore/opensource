import stringify from '../src';

test('export default function', async () => {
  expect(typeof stringify).toStrictEqual('function');
});

test('should generate shorthand from arguments list', async () => {
  expect(stringify('assemble')).toStrictEqual('assemble');
  expect(stringify('assemble', 'verb')).toStrictEqual('assemble/verb');
  expect(stringify('assemble', 'verb', 'dev')).toStrictEqual(
    'assemble/verb#dev',
  );
  expect(stringify('assemble', 'verb', 'v2.7.4', true)).toStrictEqual(
    'assemble/verb@v2.7.4',
  );
});

test('should generate shorthand from object', async () => {
  expect(stringify({ owner: 'assemble' })).toStrictEqual('assemble');
  expect(stringify({ user: 'assemble' })).toStrictEqual('assemble');
  expect(stringify({ owner: 'assemble', name: 'verb' })).toStrictEqual(
    'assemble/verb',
  );
  expect(stringify({ user: 'assemble', repo: 'verb' })).toStrictEqual(
    'assemble/verb',
  );
  expect(
    stringify({ owner: 'assemble', name: 'verb', branch: 'dev' }),
  ).toStrictEqual('assemble/verb#dev');
  expect(
    stringify({ owner: 'assemble', name: 'verb', branch: 'v2.7.4', npm: true }),
  ).toStrictEqual('assemble/verb@v2.7.4');
});

test('should throw TypeError if first argument not a string', async () => {
  expect(() => stringify(123)).toThrow(TypeError);
  expect(() => stringify(123)).toThrow(
    /stringify-github-short-url: expects `owner` to be a string/,
  );
});

test('should throw TypeError if `owner` prop not a string', async () => {
  expect(() => stringify({ owner: 123 })).toThrow(TypeError);
  expect(() => stringify({ owner: 123 })).toThrow(
    /expects `owner` to be a string/,
  );
});
