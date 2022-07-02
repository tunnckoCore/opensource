import runner from '../src/runner.js';

test('todo runner babel testing', () => {
	expect(typeof runner).toStrictEqual('function');
});
