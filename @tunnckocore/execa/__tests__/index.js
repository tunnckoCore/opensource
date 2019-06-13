import assert from 'assert';
import proc from 'process';

/* eslint-disable-next-line import/no-extraneous-dependencies */
import test from 'asia';

import { exec, shell } from '../src/index';

test('export an object with "exec" and "shell" functions', () => {
  assert.strictEqual(typeof exec, 'function');
  assert.strictEqual(typeof shell, 'function');
});

test('the `exec` accepts arguments with quotes', async () => {
  const results = await exec('echo "some content with spaces"');
  assert.strictEqual(results[0].stdout, 'some content with spaces');
});

test('the `shell` should be able to access ENVs', async () => {
  const results = await shell('echo "foo-$HOME-bar"', { env: proc.env });

  assert.ok(/^foo-.*-bar$/.test(results[0].stdout));
});
