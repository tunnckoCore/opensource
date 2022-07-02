import mod from '../src/runner.js';

test('make tests for jest-runner-docs package', async () => {
	expect(typeof mod).toStrictEqual('function');
});
