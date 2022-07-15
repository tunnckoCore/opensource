/* eslint-disable jest/expect-expect */
/*!
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 *
 * Copyright (c) 2014-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

import isBuffer from 'is-buffer';
import request from 'supertest';
import Koa from 'koa';
import betterBody from '../src/index.js';

function koa() {
  return new Koa();
}

test('should get the raw buffer body (options.buffer: true)', async () => {
  const server = koa().use(betterBody({ buffer: true }));

  // eslint-disable-next-line require-yield
  server.use(function* koaCustomPlugin() {
    expect(isBuffer(this.request.body)).toStrictEqual(true);
    this.body = this.request.body.toString('utf8');
  });

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('text')
      .send('qux')
      .expect(200)
      .expect('qux')
      .end((err) => (err ? reject(err) : resolve()));
  });
});

test('should throw if the buffer body is too large (options.buffer: true)', async () => {
  const server = koa().use(betterBody({ buffer: true, bufferLimit: '2b' }));

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('text')
      .send('too large')
      .expect(413)
      .end((err) => (err ? reject(err) : resolve()));
  });
});

test('should get json if `options.buffer` is false (that is the default)', async () => {
  const server = koa().use(betterBody());
  // eslint-disable-next-line require-yield
  server.use(function* koaCustomPlugin() {
    expect(this.request.fields).toMatchObject({ 'too large': '' });
    this.body = this.request.fields;
  });

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .send('too large')
      .expect(200)
      .expect(/"too large":/)
      .end((err) => (err ? reject(err) : resolve()));
  });
});
