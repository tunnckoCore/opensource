import execa, { exec, shell } from '../src/index.js';

test('default export execa v2 and named {shell, exec}', () => {
  expect(typeof execa).toBe('function');
  expect(typeof execa.sync).toBe('function');
  expect(typeof execa.command).toBe('function');
  expect(typeof execa.commandSync).toBe('function');
  expect(typeof execa.node).toBe('function');
  expect(typeof shell).toBe('function');
  expect(typeof exec).toBe('function');
});

test('the `exec` accepts arguments with quotes', async () => {
  const results = await exec('echo "some content with spaces"');
  expect(results[0].all).toStrictEqual('"some content with spaces"');
  expect(results[0].stdout).toStrictEqual('"some content with spaces"');

  const res = await exec('echo something');
  expect(res[0].all).toStrictEqual('something');
  expect(res[0].stdout).toStrictEqual('something');
});

test('the `shell` should be able to access ENVs', async () => {
  const results = await shell('echo "foo-$HOME-bar"', { env: process.env });

  expect(results[0].stdout).toMatch(/foo-.*-bar/);
});
