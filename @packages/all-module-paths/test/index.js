import mod from 'node:module';
import allModulePaths from '../src/index.js';

test('allModulePaths exports a function', async () => {
	expect(typeof allModulePaths).toStrictEqual('function');
});

test('result should have localModules, allPaths and globalModules properties', async () => {
	const paths = mod._nodeModulePaths(process.cwd());
	const result = allModulePaths({ paths });

	expect(result).toHaveProperty('localModules');
	expect(result.localModules).toHaveProperty('packages');
	expect(result.localModules).toHaveProperty('binaries');
	expect(result.localModules.packages.length).toBeGreaterThan(0);
	expect(result.localModules.binaries.length).toBeGreaterThan(0);

	expect(result).toHaveProperty('globalModules');
	expect(result.globalModules).toHaveProperty('packages');
	expect(result.globalModules).toHaveProperty('binaries');
	expect(result.globalModules.packages.length).toBeGreaterThan(0);
	expect(result.globalModules.binaries.length).toBeGreaterThan(0);

	expect(result).toHaveProperty('allPaths');
	expect(result.allPaths).toHaveProperty('packages');
	expect(result.allPaths).toHaveProperty('binaries');
	expect(result.allPaths.packages.length).toBeGreaterThan(
		result.localModules.packages.length,
	);
	expect(result.allPaths.binaries.length).toBeGreaterThan(
		result.localModules.packages.length,
	);
});

test('allPaths includes localModules and globalModules', async () => {
	const paths = mod._nodeModulePaths(process.cwd());
	const result = allModulePaths({ paths });

	expect(result.allPaths).toHaveProperty('packages');
	expect(result.allPaths).toHaveProperty('binaries');
	expect(result.allPaths).toMatchObject({
		packages: result.localModules.packages.concat(
			result.globalModules.packages,
		),
		binaries: result.localModules.binaries.concat(
			result.globalModules.binaries,
		),
	});
});

test('result.localModules has empty values if no options.paths passed', async () => {
	const result = allModulePaths();

	expect(result).toHaveProperty('localModules');
	expect(result.localModules).toMatchObject({ packages: [], binaries: [] });
});
