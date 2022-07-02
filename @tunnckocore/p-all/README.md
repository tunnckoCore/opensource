# @tunnckocore/p-all

> Map or loop through promises, promise-returning or async functions, serially
> or in parallel, based on Promise.all! Has a hooks system: start, beforeEach,
> afterEach, finish.

For usage, check the tests for now. Coverage is 100%, as always in the past 10
years.

It's similar to `Promise.all`, or `Promise.allSettled` more specifically, but
enhanced with a hooks system and ability to pass custom mapping function. It
works for promises and async functions.

```js
import { strict as assert } from 'node:assert';
import test from 'asia';
import { each, parallel, serial } from '@tunnckocore/p-all';

const delay = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('parallel - correct results and order', async () => {
	const order = [];
	const results = await parallel([
		() => delay(3000).then((x) => order.push('a')), // 8
		() => delay(300).then((x) => order.push('b')), // 2
		() => delay(1000).then((x) => order.push('c')), // 5
		() => delay(100).then((x) => order.push('d')), // 1
		() =>
			delay(2000).then((x) => {
				order.push('e');
				throw new Error('the "e" error');
			}), // 6
		() => delay(1500).then((x) => order.push('f')), // 7
		() => delay(560).then((x) => order.push('g')), // 3
		() => delay(880).then((x) => order.push('h')), // 4
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
		() => delay(3000).then((x) => 'a'), // 8
		() => delay(300).then((x) => 'b'), // 2
		() => delay(1000).then((x) => 'c'), // 5
		() => delay(100).then((x) => 'd'), // 1
		() =>
			delay(2000).then((x) => {
				throw new Error('the "e" error');
			}), // 6
		() => delay(1500).then((x) => 'f'), // 7
		() => delay(560).then((x) => 'g'), // 3
		() => delay(880).then((x) => 'h'), // 4
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
```

## API

### each(iterable, mapper, options)

If `mapper` is object, it's assumed `options`.

Passing `options.serial` is the same as `serial`.

You can also pass `options.args` - custom arguments passed to each function.

A hooks system:

- options.start
- options.beforeEach
- options.afterEach
- options.finish

### parallel(iterable, mapper, options)

If `mapper` is object, it's assumed `options`.

### serial(iterable, mapper, options)

If `mapper` is object, it's assumed `options`.

## License

Apache-2.0, 2022
