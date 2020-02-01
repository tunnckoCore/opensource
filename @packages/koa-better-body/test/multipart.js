/* eslint-disable require-yield */

/*!
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 *
 * Copyright (c) 2014-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

import path from 'path';
import request from 'supertest';
import Koa from 'koa';
import betterBody from '../src/index';

function koa() {
  return new Koa();
}

function filepath(name) {
  return path.join(__dirname, '..', name);
}

test('should not get multipart body if options.multipart: false', async () => {
  const server = koa()
    .use(betterBody({ multipart: false }))
    .use(function* sasa() {
      expect(this.body).toBeUndefined();
      expect(this.request.fields).toBeUndefined();
      expect(this.request.files).toBeUndefined();
      this.body = 'abc';
    });

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('multipart/form-data')
      .attach('foo', filepath('package.json'))
      .expect(200)
      .expect('abc')
      .end((err) => (err ? reject(err) : resolve()));
  });
});

test('should get multipart body by default', async () => {
  const server = koa()
    .use(betterBody())
    .use(function* sasa() {
      expect(this.request.files).toBeTruthy();
      // possible fails, because it not respect order, it's async
      // strictEqual(this.request.files[0].name, 'package.json')
      // strictEqual(this.request.files[1].name, 'README.md')
      // strictEqual(this.request.files[2].name, 'example.js')
      // strictEqual(this.request.fields.foo[0].name, 'package.json')
      // strictEqual(this.request.fields.foo[1].name, 'README.md')
      // strictEqual(this.request.fields.bar[0].name, 'example.js')
      expect(this.request.files).toHaveLength(3);
      expect(this.request.fields.foo).toHaveLength(2);
      expect(this.request.fields.bar).toHaveLength(1);
      this.body = 'ok1';
    });

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('multipart/form-data')
      .attach('foo', filepath('package.json'))
      .attach('foo', filepath('README.md'))
      .attach('bar', filepath('example.js'))
      .expect(200)
      .expect('ok1')
      .end((err) => (err ? reject(err) : resolve()));
  });
});

test('should get multipart files and fields', async () => {
  const server = koa()
    .use(betterBody())
    .use(function* sasa() {
      expect(this.request.files).toBeTruthy();
      expect(this.request.fields).toBeTruthy();
      expect(this.request.files[0].name).toStrictEqual('package.json');
      expect(this.request.fields.a).toStrictEqual('b');
      expect(this.request.fields.pkg[0].name).toStrictEqual('package.json');
      this.body = 'ok1';
    });

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('multipart/form-data')
      .field('a', 'b')
      .attach('pkg', filepath('package.json'))
      .expect(200)
      .end((err) => (err ? reject(err) : resolve()));
  });
});

test('should escape ampersand on multipart form', async () => {
  const server = koa()
    .use(betterBody())
    .use(function* sasa() {
      expect(this.request.fields).toBeTruthy();
      expect(this.request.fields.a).toStrictEqual('B&W');
      this.body = 'ok13';
    });

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('multipart/form-data')
      .field('a', 'B&W')
      .expect(200)
      .end((err) => (err ? reject(err) : resolve()));
  });
});

test('should get multiple files on same field name', async () => {
  const server = koa()
    .use(betterBody())
    .use(function* sasa() {
      expect(this.request.files).toBeTruthy();
      expect(this.request.files[0].name).toStrictEqual('package.json');
      expect(this.request.files[1].name).toStrictEqual('example.js');
      expect(this.request.fields.pkg[0].name).toStrictEqual('package.json');
      expect(this.request.fields.pkg[1].name).toStrictEqual('example.js');
      this.body = 'ok2';
    });

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('multipart/form-data')
      .attach('pkg', filepath('package.json'))
      .attach('pkg', filepath('example.js'))
      .expect(200)
      .expect('ok2')
      .end((err) => (err ? reject(err) : resolve()));
  });
});

test('should get multiple fields on same field name', async () => {
  const server = koa()
    .use(betterBody())
    .use(function* sasa() {
      expect(this.request.fields).toBeTruthy();
      expect(this.request.fields.foo).toStrictEqual(['bar', 'baz']);
      expect(this.request.fields.baz).toStrictEqual('qux');
      this.body = 'ok3';
    });

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('multipart/form-data')
      .field('foo', 'bar')
      .field('foo', 'baz')
      .field('baz', 'qux')
      .expect(200)
      .expect('ok3')
      .end((err) => (err ? reject(err) : resolve()));
  });
});

test('should get 3 or more fields on same field name', async () => {
  const server = koa()
    .use(betterBody())
    .use(function* sasa() {
      expect(this.request.fields).toBeTruthy();
      expect(this.request.fields.foo).toStrictEqual(['bar', 'baz', 'bop']);
      this.body = 'ok';
    });

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('multipart/form-data')
      .field('foo', 'bar')
      .field('foo', 'baz')
      .field('foo', 'bop')
      .expect(200)
      .expect('ok')
      .end((err) => (err ? reject(err) : resolve()));
  });
});

test('should **conflicts** between fields and files', async () => {
  const server = koa()
    .use(betterBody())
    .use(function* sasa() {
      expect(this.request.files).toBeTruthy();
      expect(this.request.fields).toBeTruthy();
      expect(this.request.files[0].name).toStrictEqual('package.json');
      expect(this.request.files[1].name).toStrictEqual('example.js');
      expect(this.request.fields.pkg[0].name).toStrictEqual('package.json');
      expect(this.request.fields.pkg[1].name).toStrictEqual('example.js');
      expect(this.request.fields.aaa).toStrictEqual(['bbb', 'ddd']);
      this.body = 'ok4';
    });

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('multipart/form-data')
      // notice that there will be files on `pkg`, not `foo` string
      .field('pkg', 'foo')
      .attach('pkg', filepath('package.json'))
      .attach('pkg', filepath('example.js'))
      .field('aaa', 'bbb')
      .field('aaa', 'ddd')
      .expect(200)
      .expect('ok4')
      .end((err) => (err ? reject(err) : resolve()));
  });
});
