'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const nodeGlob = require('glob');
const tinyGlob = require('tiny-glob');
const globCache = require('../src');

const globPromisified = util.promisify(nodeGlob);
const cwd = path.dirname(__dirname);
const cacheLocation = path.join(__dirname, 'fixture-cache');

async function runGlobCache(opts) {
  const { results } = await globCache({
    include: 'test/fixtures/*.js',
    globOptions: { cwd },
    cacheLocation,
    ...opts,
  });
  return results;
}
function fromFixtures(x) {
  return path.join(__dirname, 'fixtures', x);
}

test('supports other glob libraries', async () => {
  fs.rmdirSync(cacheLocation, { recursive: true });

  const { results } = await globCache({
    glob: tinyGlob,
    globOptions: { cwd },
    include: 'test/fixtures/*.js',
    cacheLocation,
  });
  results.forEach((ctx) => {
    expect(ctx.valid).toBe(true);
    expect(ctx.missing).toBe(true);

    expect(ctx).toHaveProperty('cacache');
    expect(ctx).toHaveProperty('cacheFile');
    expect(ctx).toHaveProperty('file');
    expect(ctx.file).toHaveProperty('path');
    expect(ctx.file).toHaveProperty('contents');
    expect(ctx.file).toHaveProperty('integrity');
    expect(ctx.file).toHaveProperty('size');
    expect(ctx.file.integrity).toMatch('sha512-');
    expect(path.dirname(ctx.file.path)).toStrictEqual(
      path.join(__dirname, 'fixtures'),
    );
    expect(ctx.cacheFile).toBeNull();
  });

  const { results: res } = await globCache({
    glob: globPromisified,
    globOptions: { cwd },
    include: 'test/fixtures/*.js',
    cacheLocation,
  });
  res.forEach((ctx) => {
    expect(ctx.valid).toBe(true);
    expect(ctx.missing).toBe(false);
    expect(ctx.cacheLocation).toStrictEqual(cacheLocation);

    expect(ctx).toHaveProperty('cacheFile');
    expect(ctx).toHaveProperty('cacache');
    expect(ctx.cacheFile).toHaveProperty('key');
    expect(ctx.cacheFile).toHaveProperty('path');
    expect(ctx.cacheFile).toHaveProperty('integrity');
    expect(ctx.cacheFile).toHaveProperty('size');
    expect(ctx.cacheFile).toHaveProperty('sri');
    expect(ctx.cacheFile).toHaveProperty('stat');
    expect(ctx.cacheFile.key).toBe(ctx.file.path);

    const pathStartsWith = path.join(cacheLocation, 'content');
    expect(ctx.cacheFile.path).toMatch(pathStartsWith);
  });

  fs.rmdirSync(cacheLocation, { recursive: true });
});

// eslint-disable-next-line max-statements
test('work when you add new matching file which is not cached', async () => {
  fs.rmdirSync(cacheLocation, { recursive: true });

  try {
    fs.unlinkSync(fromFixtures('quxie.js'));
  } catch (err) {}

  const res1 = await runGlobCache();
  expect(res1).toHaveLength(2);

  const fixtureBig1 = res1.find((ctx) => ctx.file.path.endsWith('big.js'));
  const fixtureBar1 = res1.find((ctx) => ctx.file.path.endsWith('bar.js'));

  expect(fixtureBig1.file.path).toBe(fromFixtures('big.js'));
  expect(fixtureBar1.file.path).toBe(fromFixtures('bar.js'));

  fs.writeFileSync(fromFixtures('quxie.js'), 'exports.qux = 1;');

  // second run after a new matching file is added
  const res2 = await runGlobCache();

  expect(res2).toHaveLength(3);

  const fixtureQuxie = res2.find((ctx) => ctx.file.path.endsWith('quxie.js'));
  expect(fixtureQuxie.file.path).toBe(fromFixtures('quxie.js'));
  expect(fixtureQuxie.valid).toBe(true);
  expect(fixtureQuxie.missing).toBe(true);

  const res3 = await runGlobCache();
  const quxie = res3.find((ctx) => ctx.file.path.endsWith('quxie.js'));
  expect(quxie.valid).toBe(true);
  expect(quxie.missing).toBe(false);

  // fourth run should be invalid, because we change the content here
  fs.writeFileSync(fromFixtures('quxie.js'), 'exports.hoho = 99999;');

  const zaz = (await runGlobCache()).find((ctx) =>
    ctx.file.path.endsWith('quxie.js'),
  );
  expect(zaz.valid).toBe(false);
  expect(zaz.missing).toBe(false);

  fs.unlinkSync(fromFixtures('quxie.js'));
});

test('to call options.hook on missing (options.always: true)', async () => {
  fs.rmdirSync(cacheLocation, { recursive: true });

  await runGlobCache({
    always: true,
    hook: (ctx) => {
      expect(ctx).toHaveProperty('file');
      expect(ctx).toHaveProperty('cacheFile');
      expect(ctx.cacheFile).toBeNull();
    },
  });
});

test('to call options.hook on invalid (options.always: false)', async () => {
  fs.rmdirSync(cacheLocation, { recursive: true });

  await runGlobCache({
    always: true,
    hook: (ctx) => {
      expect(ctx.valid).toBe(true);
      expect(ctx.missing).toBe(true);
      expect(ctx).toHaveProperty('cacheFile');
    },
  });

  fs.writeFileSync(fromFixtures('bar.js'), 'const aloha = 123;');

  await runGlobCache({
    always: false,
    hook: (ctx) => {
      if (ctx.file.path.endsWith('bar.js')) {
        expect(ctx).toHaveProperty('cacheFile');
        expect(ctx.cacheFile).toHaveProperty('integrity');
        expect(ctx.valid).toBe(false);
        expect(ctx.missing).toBe(false);
      }
    },
  });

  // restore original `bar.js` file fixture
  fs.writeFileSync(fromFixtures('bar.js'), 'export default () => 123;\n');
  fs.rmdirSync(cacheLocation, { recursive: true });
});
