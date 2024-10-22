import assert from 'node:assert/strict';
import { test } from 'bun:test';
import dedent from 'dedent';
import { parse, stringifyHeader } from 'parse-commit-message';
import type { Commit } from 'parse-commit-message/types.ts';

import recommendedBump from '../src/index.ts';

test('should recommended patch bump', () => {
  const allCommits = [
    'chore: foo bar baz',
    dedent`fix(cli): some bugfix msg here

    Some awesome body.

    Great footer and GPG sign off, yeah!
    Signed-off-by: Awesome footer <foobar@gmail.com>`,
  ];

  const { increment, isBreaking, patch = [], commits } = recommendedBump(allCommits);

  assert.strictEqual(Array.isArray(commits), true);
  assert.strictEqual(isBreaking, false);
  assert.strictEqual(increment, 'patch');
  assert.strictEqual(patch[0]?.header.type, 'fix');
  assert.strictEqual(patch[0]?.header.scope, 'cli');
  assert.strictEqual(patch[0]?.header.subject, 'some bugfix msg here');
  assert.strictEqual(stringifyHeader(patch[0]?.header), 'fix(cli): some bugfix msg here');
  assert.strictEqual(patch[0]?.body, 'Some awesome body.');
  assert.strictEqual(
    patch[0]?.footer,
    'Great footer and GPG sign off, yeah!\nSigned-off-by: Awesome footer <foobar@gmail.com>',
  );
});

test('should recommend minor bump', () => {
  const commitOne = parse('fix: foo bar'); // returns Commit[], but it's okay, cuz we flatting nested arrays
  const [commitTwo] = parse('feat: some feature subject');

  const result = recommendedBump([commitOne, commitTwo] as Commit[]);
  assert.strictEqual(result.increment, 'minor');
  assert.strictEqual(result.isBreaking, false);
});

test('should recommend major bump from `fix` type', () => {
  const result = recommendedBump(['feat: ho ho ho', 'fix: foo bar baz\n\nBREAKING CHANGE: ouch!']);

  assert.strictEqual(Array.isArray(result.commits), true);
  assert.strictEqual(result.increment, 'major');
  assert.strictEqual(result.isBreaking, true);
  assert.strictEqual(result.major?.[0]?.header.type, 'fix');
  assert.strictEqual(result.major?.[0]?.header.subject, 'foo bar baz');
  assert.strictEqual(result.major?.[0]?.body, 'BREAKING CHANGE: ouch!');

  assert.deepStrictEqual(result.minor?.[0]?.header, {
    type: 'feat',
    scope: null,
    subject: 'ho ho ho',
  });
});

test('should return { increment: false, commits: Array<Commit> } when no need for bump', () => {
  const result = recommendedBump([
    'chore(ci): update ci config',
    'test: ok okey boody man',
    'refactor: some tweaks',
  ]);

  assert.strictEqual(result.increment, false);
  assert.strictEqual(result.isBreaking, false);

  assert.strictEqual(Array.isArray(result.commits), true);
  const [one, two, three] = result.commits;
  assert.deepStrictEqual(one?.header, {
    type: 'chore',
    scope: 'ci',
    subject: 'update ci config',
  });
  assert.deepStrictEqual(two?.header, {
    type: 'test',
    scope: null,
    subject: 'ok okey boody man',
  });
  assert.deepStrictEqual(three?.header, {
    type: 'refactor',
    scope: null,
    subject: 'some tweaks',
  });
});
