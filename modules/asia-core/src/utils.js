// SPDX-License-Identifier: MPL-2.0

// note: Sindre, MIT, `callsites`
export function callplaces() {
	const _prepareStackTrace = Error.prepareStackTrace;
	Error.prepareStackTrace = (_, stack) => stack;
	// eslint-disable-next-line unicorn/error-message
	const stack = new Error().stack.slice(1);
	Error.prepareStackTrace = _prepareStackTrace;
	return stack;
}

export function cleanerStack(val) {
	return (val || '')
		.split('\n')
		.filter((x) => {
			const exclude = x.includes('asia/src') || x.includes('async Promise.all');

			if (exclude) {
				return false;
			}

			return true;
		})
		.map((x) => (x.trim().startsWith('at') ? `  ${x.trim()}` : x.trim()))
		.join('\n');
}

export const ansiWrap = (a, b, str) => `\u001B[${a}m${str}\u001B[${b}m`;
export const ansiRed = (str) => ansiWrap(31, 39, str);

export function basicReporter(item, cfg) {
	const idx = item.index + 1; // print from 1, not from 0.
	const onlyFailed = cfg.env?.ASIA_ONLY_FAILED === '1';

	if (item.status === 'rejected') {
		console.error(ansiRed('not ok %s - %s'), idx, item.reason.title);
		console.error('');
		console.error(item.reason.stack);
		console.error('');
	}
	if (!onlyFailed && item.status === 'fulfilled') {
		console.log('ok %s - %s', idx, item.value.title);
	}
}

// eslint-disable-next-line no-unused-vars
export function filter(cfg, { title, testPath, callsites }) {
	const match = cfg.env.ASIA_MATCH || '';

	console.log(match);
	const byPath = match
		? testPath.includes(match) || new RegExp(match).test(testPath)
		: false;

	const byTitle =
		byPath === false && match
			? title.includes(match) || new RegExp(match).test(title)
			: false;

	return byPath || byTitle;
}
