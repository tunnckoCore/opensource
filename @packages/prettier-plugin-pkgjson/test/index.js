const mod = require('../src');

test('todo tests for prettier-plugin-pkgjson package', async () => {
	expect(typeof mod).toStrictEqual('object');
	expect(mod).toHaveProperty('parsers');
	expect(mod).toHaveProperty('name');
	expect(mod.name).toStrictEqual('prettier-plugin-pkgjson');
});
