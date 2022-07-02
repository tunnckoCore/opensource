'use strict';

const preset = require('../src/index');

test('should assert Babel 7', () => {
	expect(preset).toEqual(expect.any(Function));
	const assertVersion = jest.fn();
	preset({ assertVersion }, {});
	expect(assertVersion).toHaveBeenCalledWith(7);
});

test('should preset return plugins and presets', () => {
	expect(preset).toEqual(expect.any(Function));

	const config = preset({ assertVersion() {} }, {});
	expect(config).toHaveProperty('plugins');
	expect(config).toHaveProperty('presets');
	expect(config.plugins).toEqual(expect.any(Array));
	expect(config.presets.length).toBe(1);
	expect(config.presets).toEqual(
		expect.arrayContaining(['@babel/preset-modules']),
	);
});

test('should include react presets & plugins', () => {
	const config = preset({ assertVersion() {} }, { jsx: true });

	expect(config).toHaveProperty('plugins');
	expect(config).toHaveProperty('presets');
	expect(config.presets.length).toBe(2);
	expect(config.presets).toEqual(
		expect.arrayContaining(['@babel/preset-react']),
	);
});

test('should include transform-modules-commonjs when options.commonjs: true', () => {
	const config = preset({ assertVersion() {} }, { commonjs: true });

	expect(config).toHaveProperty('plugins');
	expect(config).toHaveProperty('presets');
	expect(config.presets.length).toBe(1);
	expect(config.plugins).toEqual(
		expect.arrayContaining(['@babel/plugin-transform-modules-commonjs']),
	);
});

test('should include react and typescript presets', () => {
	const config = preset(
		{ assertVersion() {} },
		{ typescript: true, jsx: true },
	);

	expect(config.presets.length).toBe(3);
	expect(config.presets).toEqual(
		expect.arrayContaining([
			'@babel/preset-modules',
			'@babel/preset-react',
			['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
		]),
	);
});

test('should allow JSX/react customization', () => {
	const config = preset(
		{ assertVersion() {} },
		{ typescript: true, jsx: { pragma: 'h', useSpread: true } },
	);

	expect(config.presets.length).toBe(3);
	expect(config.presets).toEqual(
		expect.arrayContaining([
			'@babel/preset-modules',
			['@babel/preset-react', { pragma: 'h', useSpread: true }],
			[
				'@babel/preset-typescript',
				{ jsxPragma: 'h', isTSX: true, allExtensions: true },
			],
		]),
	);
});

test('should include minify-builtins plugin', () => {
	const config = preset({ assertVersion() {} }, { minifyBuiltins: true });

	expect(config.presets.length).toBe(1);
	expect(config.plugins.length).toBe(11);
	expect(config.plugins).toEqual(
		expect.arrayContaining(['babel-plugin-minify-builtins']),
	);
});

test('should include all presets (3) and plugins (15)', () => {
	const config = preset(
		{ assertVersion() {} },
		{ jsx: true, commonjs: true, typescript: true, minifyBuiltins: true },
	);

	expect(config.presets.length).toBe(3);
	expect(config.plugins.length).toBe(15);
});

test('should add react plugins when react: true', () => {
	const config = preset(
		{ assertVersion() {} },
		{ minifyBuiltins: true, jsx: true },
	);

	expect(config.presets.length).toBe(2);
	expect(config.plugins.length).toBe(14);
	expect(config.plugins).toEqual(
		expect.arrayContaining([
			'babel-plugin-minify-builtins',
			'babel-plugin-transform-react-constant-elements',
			'babel-plugin-transform-react-pure-class-to-function',
			[
				'babel-plugin-transform-react-remove-prop-types',
				{ removeImport: true },
			],
		]),
	);
});
