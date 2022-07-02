// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-param-reassign */
/* eslint-disable promise/prefer-await-to-callbacks */
/* eslint-disable promise/prefer-await-to-then */

export async function parallel(items, mapper, options = {}) {
	return each(items, mapper, { ...options, serial: false });
}

export async function serial(items, mapper, options = {}) {
	return each(items, mapper, { ...options, serial: true });
}

export async function each(items, mapper, options = {}) {
	if (typeof mapper !== 'function') {
		options = mapper;
		mapper = (x) => x;
	}

	const opts = {
		start() {},
		beforeEach() {},
		afterEach() {},
		finish() {},
		// TODO?
		// stopOnError: false,
		...options,
	};
	opts.args = [{ context: {} }];

	await opts.start(items);

	const handle = handler(items, mapper, opts);
	const done = async (results) => {
		const ret = await opts.finish(results, items);
		return ret || results;
	};

	if (opts.serial) {
		const results = [];

		for await (const item of items) {
			const res = await handle(item, results.length);

			results.push(res);
		}

		return done(results);
	}

	return Promise.all(items.map((x, index) => handle(x, index))).then(done);
}

function handler(items, mapper, opts) {
	return async function handleSingle(item, index) {
		const promise = promisify(item, ...opts.args);

		// TODO: check if the bug with all beforeEach hooks
		// TODO: get called at the same time (some memories it is happening)
		await opts.beforeEach(
			{ status: 'pending', value: promise, index },
			index,
			items,
		);

		return promise

			.then(
				async (value) => {
					const res = { status: 'fulfilled', value, index };
					const ret = await opts.afterEach(res, index, items);

					return { ...res, ...ret };
				},
				async (err) => {
					const res = { status: 'rejected', reason: err, index };
					const ret = await opts.afterEach(res, index, items);

					return { ...res, ...ret };
				},
			)
			.then((res) => mapper(res, index) || res);
	};
}

function promisify(val, ...args) {
	return new Promise((resolve) => {
		resolve(typeof val === 'function' ? val(...args) : val);
	});
}
