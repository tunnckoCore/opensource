/* eslint-disable promise/prefer-await-to-then */
import { setTimeout as delay } from 'node:timers/promises';
import asia from './src/index.js';

// import asia, { loadConfig } from './src/index.js';
// const config = await loadConfig("../asia.config.js");
const { test, run } = asia(/* config */);

test("some 'a' tst", () => delay(3000).then(() => 'a')); // 8
test("some 'b' tst", () => delay(300).then(() => 'b')); // 2
test("some 'c' tst", () => delay(1000).then(() => 'c')); // 5
test("some 'd' tst", () => delay(100).then(() => 'd')); // 1
test("some 'e' tst", () =>
	delay(2000).then(() => {
		throw new Error('the "e" error');
	})); // 6
test("some 'f' tst", () => delay(1500).then(() => 'f')); // 7
test("some 'g' tst", () => delay(560).then(() => 'g')); // 3
test("some 'h' tst", () => delay(880).then(() => 'h')); // 4

await run();
