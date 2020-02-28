import packageJson, { PackageJsonError } from '../src/index';

test('return package metadata', async () => {
  const pkg = await packageJson('babel-preset-optimise');
  expect(pkg.name).toStrictEqual('babel-preset-optimise');
});

test('for specific version + scoped', async () => {
  const pkg = await packageJson('@tunnckocore/package-json@1.0.3');
  expect(pkg.version).toStrictEqual('1.0.3');
  expect(pkg.repository).toStrictEqual('tunnckoCoreLabs/package-json');
});

test('throw for not existing package', async () => {
  await expect(packageJson('ksjdf4jdhfkjsd')).rejects.toThrow(Error);
  await expect(packageJson('ksjdf4jdhfkjsd')).rejects.toThrow(PackageJsonError);
  await expect(packageJson('ksjdf4jdhfkjsd')).rejects.toThrow(
    /Package "ksjdf4jdhfkjsd" not found/,
  );
});

test('get package.json using custom `endpoint` option', async () => {
  const pkg = await packageJson(
    'package-json@4.0.0',
    (name, tag) => `https://registry.npmjs.org/${name}/${tag}`,
  );

  expect(pkg.name).toStrictEqual('package-json');
  expect(pkg.version).toStrictEqual('4.0.0');
});
