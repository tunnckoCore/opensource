import runner from '../src/runner.js';

test('todo jest-runner-eslint tests', () => {
	expect(typeof runner).toStrictEqual('function');
});
