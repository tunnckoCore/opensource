/*!
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 *
 * Copyright (c) 2014-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

import { promisify } from 'util';
import isBuffer from 'is-buffer';
import request from 'supertest';
import koa from 'koa';
import betterBody from '../src';

test('should get the raw buffer body (options.buffer: true)', async () => {
  const server = koa().use(betterBody({ buffer: true }));
  // eslint-disable-next-line require-yield
  server.use(function* koaCustomPlugin() {
    test.strictEqual(isBuffer(this.request.body), true);
    this.body = this.request.body.toString('utf8');
  });
  await promisify(
    request(server.callback())
      .post('/')
      .type('text')
      .send('qux')
      .expect(200)
      .expect('qux').end,
  )();
});
test('should throw if the buffer body is too large (options.buffer: true)', async () => {
  const server = koa().use(betterBody({ buffer: true, bufferLimit: '2b' }));

  await promisify(
    request(server.callback())
      .post('/')
      .type('text')
      .send('too large')
      .expect(413).end,
  )();
});
test('should get json if `options.buffer` is false (that is the default)', async () => {
  const server = koa().use(betterBody());
  // eslint-disable-next-line require-yield
  server.use(function* koaCustomPlugin() {
    test.strictEqual(typeof this.request.fields, 'object');
    test.deepEqual(this.request.fields, { 'too large': '' });
    this.body = this.request.fields;
  });

  await promisify(
    request(server.callback())
      .post('/')
      .send('too large')
      .expect(200)
      .expect(/"too large":/).end,
  )();
});
