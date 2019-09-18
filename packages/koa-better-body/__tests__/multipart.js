/* eslint-disable require-yield */

/*!
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 *
 * Copyright (c) 2014-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

import path from 'path';
import { promisify } from 'util';
import request from 'supertest';
import koa from 'koa';
import betterBody from '../src';

function filepath(name) {
  return path.join(__dirname, '..', name);
}

test('should not get multipart body if options.multipart: false', async () => {
  const server = koa().use(betterBody({ multipart: false }));
  server.use(function* sasa() {
    test.strictEqual(this.body, undefined);
    test.strictEqual(this.request.fields, undefined);
    test.strictEqual(this.request.files, undefined);
    this.body = 'abc';
  });

  await promisify(
    request(server.callback())
      .post('/')
      .type('multipart/form-data')
      .attach('foo', filepath('package.json'))
      .expect(200)
      .expect('abc').end,
  )();
});
test('should get multipart body by default', async () => {
  const server = koa().use(betterBody());
  server.use(function* sasa() {
    test.ok(this.request.files);
    // possible fails, because it not respect order, it's async
    // test.strictEqual(this.request.files[0].name, 'LICENSE')
    // test.strictEqual(this.request.files[1].name, 'README.md')
    // test.strictEqual(this.request.files[2].name, 'utils.js')
    // test.strictEqual(this.request.fields.foo[0].name, 'LICENSE')
    // test.strictEqual(this.request.fields.foo[1].name, 'README.md')
    // test.strictEqual(this.request.fields.bar[0].name, 'utils.js')
    test.strictEqual(this.request.files.length, 3, 'should be 3 files');
    test.strictEqual(
      this.request.fields.foo.length,
      2,
      'should fields.foo to have 2 files',
    );
    test.strictEqual(
      this.request.fields.bar.length,
      1,
      'should fields.bar to have 1 file',
    );
    this.body = 'ok1';
  });

  await promisify(
    request(server.callback())
      .post('/')
      .type('multipart/form-data')
      .attach('foo', filepath('LICENSE'))
      .attach('foo', filepath('README.md'))
      .attach('bar', filepath('utils.js'))
      .expect(200)
      .expect('ok1').end,
  )();
});
test('should get multipart files and fields', async () => {
  const server = koa().use(betterBody());
  server.use(function* sasa() {
    test.ok(this.request.files);
    test.ok(this.request.fields);
    test.strictEqual(this.request.files[0].name, 'package.json');
    test.strictEqual(this.request.fields.a, 'b');
    test.strictEqual(this.request.fields.pkg[0].name, 'package.json');
    this.body = 'ok1';
  });

  await promisify(
    request(server.callback())
      .post('/')
      .type('multipart/form-data')
      .field('a', 'b')
      .attach('pkg', filepath('package.json'))
      .expect(200).end,
  )();
});

test('should escape ampersand on multipart form', async () => {
  const server = koa().use(betterBody());
  server.use(function* sasa() {
    test.ok(this.request.fields);
    test.deepEqual(this.request.fields.a, 'B&W');
    this.body = 'ok13';
  });

  await promisify(
    request(server.callback())
      .post('/')
      .type('multipart/form-data')
      .field('a', 'B&W')
      .expect(200).end,
  )();
});

test('should get multiple files on same field name', async () => {
  const server = koa().use(betterBody());
  server.use(function* sasa() {
    test.ok(this.request.files);
    test.strictEqual(this.request.files[0].name, 'package.json');
    test.strictEqual(this.request.files[1].name, 'utils.js');
    test.strictEqual(this.request.fields.pkg[0].name, 'package.json');
    test.strictEqual(this.request.fields.pkg[1].name, 'utils.js');
    this.body = 'ok2';
  });

  await promisify(
    request(server.callback())
      .post('/')
      .type('multipart/form-data')
      .attach('pkg', filepath('package.json'))
      .attach('pkg', filepath('utils.js'))
      .expect(200)
      .expect('ok2').end,
  )();
});
test('should get multiple fields on same field name', async () => {
  const server = koa().use(betterBody());
  server.use(function* sasa() {
    test.ok(this.request.fields);
    test.deepEqual(this.request.fields.foo, ['bar', 'baz']);
    test.strictEqual(this.request.fields.baz, 'qux');
    this.body = 'ok3';
  });

  await promisify(
    request(server.callback())
      .post('/')
      .type('multipart/form-data')
      .field('foo', 'bar')
      .field('foo', 'baz')
      .field('baz', 'qux')
      .expect(200)
      .expect('ok3').end,
  )();
});
test('should get 3 or more fields on same field name', async () => {
  const server = koa().use(betterBody());
  server.use(function* sasa() {
    test.ok(this.request.fields);
    test.deepEqual(this.request.fields.foo, ['bar', 'baz', 'bop']);
    this.body = 'ok';
  });

  await promisify(
    request(server.callback())
      .post('/')
      .type('multipart/form-data')
      .field('foo', 'bar')
      .field('foo', 'baz')
      .field('foo', 'bop')
      .expect(200)
      .expect('ok').end,
  )();
});
test('should **conflicts** between fields and files', async () => {
  const server = koa().use(betterBody());
  server.use(function* sasa() {
    test.ok(this.request.files);
    test.ok(this.request.fields);
    test.strictEqual(this.request.files[0].name, 'package.json');
    test.strictEqual(this.request.files[1].name, 'utils.js');
    test.strictEqual(this.request.fields.pkg[0].name, 'package.json');
    test.strictEqual(this.request.fields.pkg[1].name, 'utils.js');
    test.deepEqual(this.request.fields.aaa, ['bbb', 'ddd']);
    this.body = 'ok4';
  });

  await promisify(
    request(server.callback())
      .post('/')
      .type('multipart/form-data')
      // notice that there will be files on `pkg`, not `foo` string
      .field('pkg', 'foo')
      .attach('pkg', filepath('package.json'))
      .attach('pkg', filepath('utils.js'))
      .field('aaa', 'bbb')
      .field('aaa', 'ddd')
      .expect(200)
      .expect('ok4').end,
  )();
});
