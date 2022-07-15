'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const rimraf = require('rimraf');
const nodeGlob = require('glob');
const globby = require('globby');
const globCache = require('../src/index');

const del = util.promisify(rimraf);
const glob = util.promisify(nodeGlob);
const cwd = path.dirname(__dirname);
const cacheRoot = path.join(cwd, '.cache');
const cacheLocation = path.join(cacheRoot, 'fixture-cache');

async function runGlobCache(opts) {
  const results = await globCache.promise({
    buffered: true,
    include: 'test/fixtures/*.js',
    cwd,
    cacheLocation,
    ...opts,
  });
  return results;
}

function fromFixtures(x) {
  return path.join(__dirname, 'fixtures', x);
}

test('supports other glob libraries', async () => {
  await del(cacheRoot, { recursive: true });

  const results = await runGlobCache({ glob: globby.stream });
  for (const ctx of results) {
    expect(ctx.changed).toBe(true);
    expect(ctx.notFound).toBe(true);

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
  }

  const res = await runGlobCache({ glob });
  for (const ctx of res) {
    expect(ctx.changed).toBe(false);
    expect(ctx.notFound).toBe(false);
    expect(ctx.cacheLocation).toStrictEqual(cacheLocation);

    expect(ctx).toHaveProperty('cacheFile');
    expect(ctx).toHaveProperty('cacache');
    expect(ctx.cacheFile).toHaveProperty('key');
    expect(ctx.cacheFile).toHaveProperty('path');
    expect(ctx.cacheFile).toHaveProperty('integrity');
    expect(ctx.cacheFile).toHaveProperty('size');
    expect(ctx.cacheFile).toHaveProperty('stat');
    expect(ctx.cacheFile.key).toBe(ctx.file.path);

    const pathStartsWith = path.join(cacheLocation, 'content');
    expect(ctx.cacheFile.path).toMatch(pathStartsWith);
  }

  await del(cacheRoot, { recursive: true });
});

// eslint-disable-next-line max-statements
test('work when you add new matching file which is not cached', async () => {
  await del(cacheRoot, { recursive: true });

  try {
    fs.unlinkSync(fromFixtures('quxie.js'));
  } catch {}

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
  expect(fixtureQuxie.changed).toBe(true);
  expect(fixtureQuxie.notFound).toBe(true);

  const res3 = await runGlobCache();
  const quxie = res3.find((ctx) => ctx.file.path.endsWith('quxie.js'));
  expect(quxie.changed).toBe(false);
  expect(quxie.notFound).toBe(false);

  fs.writeFileSync(fromFixtures('quxie.js'), 'exports.hoho = 99999;');

  // fourth run should be invalid, because we change the content here
  const zaz = (await runGlobCache()).find((ctx) =>
    ctx.file.path.endsWith('quxie.js'),
  );
  expect(zaz.changed).toBe(true);
  expect(zaz.notFound).toBe(false);

  fs.unlinkSync(fromFixtures('quxie.js'));

  await del(cacheRoot, { recursive: true });
});

test('to call `notFound` and `always` hooks on missing from cache', async () => {
  await del(cacheRoot, { recursive: true });

  await runGlobCache({
    hooks: {
      notFound(ctx) {
        expect(ctx.changed).toBe(true);
        expect(ctx.notFound).toBe(true);
        expect(ctx).toHaveProperty('file');
        expect(ctx).toHaveProperty('cacheFile');
        expect(ctx.cacheFile).toBeNull();
      },
      always(ctx) {
        expect(ctx.changed).toBe(true);
        expect(ctx.notFound).toBe(true);
        expect(ctx).toHaveProperty('file');
        expect(ctx).toHaveProperty('cacheFile');
        expect(ctx.cacheFile).toBeNull();
      },
    },
  });

  await del(cacheRoot, { recursive: true });
});

test('to call options.hooks.changed on invalid', async () => {
  await del(cacheRoot, { recursive: true });

  await runGlobCache({
    hooks: {
      always(ctx) {
        expect(ctx.changed).toBe(true);
        expect(ctx.notFound).toBe(true);
        expect(ctx).toHaveProperty('cacheFile');
        expect(ctx.cacheFile).toBeNull();
      },
    },
  });
  await runGlobCache({
    hooks: {
      always(ctx) {
        expect(ctx.changed).toBe(false);
        expect(ctx.notFound).toBe(false);
        expect(ctx).toHaveProperty('cacheFile');
        expect(ctx.cacheFile).not.toBeNull();
        expect(ctx.cacheFile).toHaveProperty('integrity');
      },
    },
  });

  fs.writeFileSync(fromFixtures('bar.js'), 'const aloha = 123;');

  await runGlobCache({
    hooks: {
      changed(ctx) {
        expect(ctx.changed).toBe(true);
        expect(ctx.notFound).toBe(false);

        if (ctx.file.path.endsWith('bar.js')) {
          expect(ctx).toHaveProperty('cacheFile');
          expect(ctx.cacheFile).not.toBeNull();
          expect(ctx.cacheFile).toHaveProperty('integrity');
        }
      },
    },
  });

  // restore original `bar.js` file fixture
  fs.writeFileSync(fromFixtures('bar.js'), 'export default () => 123;\n');

  await del(cacheRoot, { recursive: true });
});

test('throw if any hook is not a function', async () => {
  await del(cacheRoot, { recursive: true });

  // eslint-disable-next-line unicorn/consistent-function-scoping
  async function fixtureToThrows() {
    await globCache.promise({
      buffered: false,
      cwd,
      hooks: { foo: 123 },
    });
  }

  await expect(fixtureToThrows()).rejects.toThrow(Error);
  await expect(fixtureToThrows()).rejects.toThrow(
    /expect hook "foo" to be function/,
  );
  await del(cacheRoot, { recursive: true });
});

test('streaming works and returns async iterable', async () => {
  await del(cacheRoot, { recursive: true });

  let count = 0;
  const iterable = globCache('test/fixtures/*.js', {
    cwd,
    ignores: ['fake.js'],
  });

  for await (const ctx of iterable) {
    expect(ctx.changed).toBe(true);
    expect(ctx.notFound).toBe(true);
    expect(ctx).toHaveProperty('cacheFile');
    expect(ctx.cacheFile).toBeNull();
    count += 1;
  }
  expect(count).toStrictEqual(2);
  count = 0;

  const stream = globCache.stream({
    cwd,
    patterns: 'test/fixtures/*.js',
    globOptions: {
      ignore: 'test/fixtures/bar.js',
    },
  });

  for await (const ctx of stream) {
    expect(ctx.changed).toBe(false);
    expect(ctx.notFound).toBe(false);
    expect(ctx).toHaveProperty('cacheFile');
    expect(ctx.cacheFile).not.toBeNull();
    count += 1;
  }

  expect(count).toStrictEqual(1);

  await del(cacheRoot, { recursive: true });
});

test('promise API return empty results array when options.buffered is falsey', async () => {
  await del(cacheRoot, { recursive: true });

  const res = await globCache.promise({
    buffered: false,
    cwd,
    include: 'test/fixtures/*.js',
    hooks: {
      always(ctx) {
        expect(ctx.changed).toBe(true);
        expect(ctx.notFound).toBe(true);
      },
    },
  });

  expect(res).toStrictEqual([]);
  expect(res.length).toStrictEqual(0);

  await del(cacheRoot, { recursive: true });
});
