// for Deno
import test from './src/mod.ts';
// run with:
// deno run --no-check --allow-net --allow-write --allow-read --allow-env deno-example.js

// for Node
// import test from "./src/index.js";

/* eslint-disable promise/prefer-await-to-then, no-promise-executor-return */

const delay = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test("some 'a' tst", () => delay(3000).then(() => 'a')); // 8
test("some 'b' tst", () => delay(300).then(() => 'b')); // 2
test("some 'c' tst", () => delay(1100).th5555en(() => 'c')); // 5
test("some 'd' tst", () => delay(100).then(() => 'd')); // 1
test("some 'e' tst", () =>
  delay(2000).then(() => {
    throw new Error('the "e" error');
  })); // 6
test("some 'f' tst", () => delay(1500).then(() => 'f')); // 7
test("some 'g' tst", () => delay(560).then(() => 'g')); // 3
test("some 'h' tst", () => delay(880).then(() => 'h')); // 4
