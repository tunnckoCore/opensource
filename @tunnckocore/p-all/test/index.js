// SPDX-License-Identifier: Apache-2.0

/* eslint-disable promise/prefer-await-to-then */

import { strict as assert } from 'node:assert';
import test from 'asia';
import { each, parallel, serial } from '../src/index.js';

// eslint-disable-next-line no-promise-executor-return
const delay = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('parallel - correct results and order', async () => {
  const order = [];
  const results = await parallel([
    () => delay(3000).then(() => order.push('a')), // 8
    () => delay(300).then(() => order.push('b')), // 2
    () => delay(1000).then(() => order.push('c')), // 5
    () => delay(100).then(() => order.push('d')), // 1
    () =>
      delay(2000).then(() => {
        order.push('e');
        throw new Error('the "e" error');
      }), // 6
    () => delay(1500).then(() => order.push('f')), // 7
    () => delay(560).then(() => order.push('g')), // 3
    () => delay(880).then(() => order.push('h')), // 4
  ]);

  assert.deepEqual(results, [
    { status: 'fulfilled', value: 8, index: 0 },
    { status: 'fulfilled', value: 2, index: 1 },
    { status: 'fulfilled', value: 5, index: 2 },
    { status: 'fulfilled', value: 1, index: 3 },
    {
      status: 'rejected',
      reason: results[4].reason, // well.. lol
      index: 4,
    },
    { status: 'fulfilled', value: 6, index: 5 },
    { status: 'fulfilled', value: 3, index: 6 },
    { status: 'fulfilled', value: 4, index: 7 },
  ]);
  assert.deepEqual(order, ['d', 'b', 'g', 'h', 'c', 'f', 'e', 'a']);
});

test('serial - force run in series', async () => {
  const fixture = [
    () => delay(3000).then(() => 'a'), // 8
    () => delay(300).then(() => 'b'), // 2
    () => delay(1000).then(() => 'c'), // 5
    () => delay(100).then(() => 'd'), // 1
    () =>
      delay(2000).then(() => {
        throw new Error('the "e" error');
      }), // 6
    () => delay(1500).then(() => 'f'), // 7
    () => delay(560).then(() => 'g'), // 3
    () => delay(880).then(() => 'h'), // 4
  ];

  const results = await each(fixture, { serial: true });

  assert.deepEqual(
    results.map((x) => x.value),
    ['a', 'b', 'c', 'd', undefined, 'f', 'g', 'h'],
  );

  const serialResults = await serial(fixture);
  assert.deepEqual(
    serialResults.map((x) => x.value),
    ['a', 'b', 'c', 'd', undefined, 'f', 'g', 'h'],
  );
});

test('custom mapper() function', async () => {
  const res = [];
  const results = await serial(
    [() => 3, 2, () => 5, () => 1, () => 4],
    function mapper(item, index) {
      res.push(item);
      return index > 2 ? item : undefined;
    },
  );

  assert.deepEqual(results, res);
});
