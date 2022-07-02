// SPDX-License-Identifier: MPL-2.0

export default async (options, program) => {
	const description = 'Run tests with ASIA test framework';

	// if program is passed, then it's assumed singleMode
	const prefix = program ? '' : 'test ';

	let prog = null;

	if (program) {
		prog = program.usage('[...patterns]', description);
	} else {
		const { hela } = await import('@hela/core');
		prog = hela(options).command(`${prefix}[...patterns]`, description);
	}

	// TODO: seems like Yaro doesn't work OK, when it's boolean
	// it works if the default is non-boolean, e.g. the `-c, --config` works
	return (
		prog
			.option('-f, --force', 'Force running test without cache', false)
			.option('--cache-clean', 'Clear the disk cache', false)
			.option('--only-failed', 'Print only failed tests', false)
			// TODO: passing custom filter to `asia --filter 'foo'` does not work!
			// NOTE: it doesn't work when using `hela test` either
			// we doesn't call asia-core's from where the `env.ASIA_MATCH` is read
			.option('--filter', 'Filter tests by path or by title')
	);
};
