import gitcloneDefaults from '../src/index.js';

test('should export default function', async () => {
  expect(typeof gitcloneDefaults).toStrictEqual('function');
});

test('should get `ssh: false` and `dest: false` by default', async () => {
  const res = gitcloneDefaults('gulpjs/gulp');
  expect(res.owner).toStrictEqual('gulpjs');
  expect(res.name).toStrictEqual('gulp');
  expect(res.ssh).toStrictEqual(false);
  expect(res.dest).toStrictEqual(false);
});

test('should get parsed object from object', async () => {
  const actual = gitcloneDefaults({ user: 'node-minibase', repo: 'minibase' });
  expect(actual.owner).toStrictEqual('node-minibase');
  expect(actual.name).toStrictEqual('minibase');
});

test('should get specific branch from user/repo#branch pattern', async () => {
  const result = gitcloneDefaults('verbose/verb#dev');
  expect(result.owner).toStrictEqual('verbose');
  expect(result.name).toStrictEqual('verb');
  expect(result.branch).toStrictEqual('dev');
});

test('should be ssh:true if second argument is `true`', async () => {
  const res = gitcloneDefaults('jonschlinkert/micromatch', true);
  expect(res.ssh).toStrictEqual(true);
});

test('should be ssh:true if third argument is `true`', async () => {
  expect(gitcloneDefaults('foo', 'bar', true).ssh).toStrictEqual(true);
  expect(gitcloneDefaults('foo', 'bar', true).owner).toStrictEqual('foo');
  expect(gitcloneDefaults('foo', 'bar', true).name).toStrictEqual('bar');
});

test('should be branch `qux` if third argument is string', async () => {
  expect(gitcloneDefaults('aaa', 'bbb', 'qux').name).toStrictEqual('bbb');
  expect(gitcloneDefaults('aaa', 'bbb', 'qux').owner).toStrictEqual('aaa');
  expect(gitcloneDefaults('aaa', 'bbb', 'qux').branch).toStrictEqual('qux');
  expect(gitcloneDefaults('aaa', 'bbb', 'qux', true).ssh).toStrictEqual(true);
});

test('should get branch if second arg is object with `branch` prop', async () => {
  const res = gitcloneDefaults('abc/def', { branch: 'beta' });
  expect(res.name).toStrictEqual('def');
  expect(res.owner).toStrictEqual('abc');
  expect(res.branch).toStrictEqual('beta');
});

test('should get dest `dev` if second arg is object with `dest` prop', async () => {
  const foo = gitcloneDefaults('tunnckoCore/charlike', { dest: 'tunncko' });
  expect(foo.name).toStrictEqual('charlike');
  expect(foo.dest).toStrictEqual('tunncko');
});

test('should get dest if third arg is object with `dest` prop', async () => {
  const bar = gitcloneDefaults('hybridables', 'always-done', { dest: 'done' });
  expect(bar.name).toStrictEqual('always-done');
  expect(bar.dest).toStrictEqual('done');
});

test('should get branch if third arg is object with `branch` prop', async () => {
  const bar = gitcloneDefaults('hybridables', 'always-done', { branch: 'dev' });
  expect(bar.name).toStrictEqual('always-done');
  expect(bar.branch).toStrictEqual('dev');
});
