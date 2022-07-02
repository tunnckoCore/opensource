<p align="center">
  <img
    align="center"
    src="https://rawcdn.githack.com/tunnckoCore/opensource/master/asia/asia/logo.png"
  />
</p>

# asia-core

> Modern, fast, and innovative test runner with parallelism, concurrency,
> caching and incremental testing. Since 2017.

## Highlights

- Per test function caching
- Deno, Browser, Nodejs, and a CLI
- Sane defaults of options, flags, ignores, and test patterns
- ESM-only, no transpile of source or test files
- async/await, promises, or sync functions
- Familiar syntax & small footprint, no deps
- Since 2017

## Install

This module is ESM-only, or with at least Node.js v16+

```
yarn add -D asia
```

you may also want the cli, otherwise you can just `node test.js` your test file.

```
yarn add -D asia-cli

asia --help
```

## Example

Your test file be like:

```js
import { strict as assert } from 'node:assert';
import test from 'asia';

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
```

and you run

```
asia
# or reloading the cache
asia --force
```

or in your scripts with `c8` (a modern `nyc` replacement, test coverage)

```json
{
	"scripts": {
		"cov": "c8 asia --force",
		"test": "asia"
	}
	"dependencies": {
		"asia": "*",
		"asia-cli": "*",
		"c8": "*"
	}
}
```

**Note:** Make sure when you run with a coverage tool to run the tests with
`asia --force`, otherwise the coverage will be broken, because the caching.
