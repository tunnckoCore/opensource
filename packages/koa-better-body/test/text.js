/* eslint-disable require-yield */
/*!
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 *
 * Copyright (c) 2014-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

import { promisify } from 'util';
import request from 'supertest';
import koa from 'koa';
import betterBody from '../src';

const app = koa().use(betterBody());

test('should get the raw text body', async () => {
  app.use(function* sasa() {
    test.strictEqual(this.request.fields, undefined);
    test.strictEqual(typeof this.request.body, 'string');
    test.strictEqual(this.request.body, 'message=lol');
    this.body = this.request.body;
  });

  await promisify(
    request(app.callback())
      .post('/')
      .type('text')
      .send('message=lol')
      .expect(200)
      .expect('message=lol').end,
  )();
});
test('should throw if the body is too large', async () => {
  const server = koa().use(betterBody({ textLimit: '2b' }));

  await promisify(
    request(server.callback())
      .post('/')
      .type('text')
      .send('foobar')
      .expect(413).end,
  )();
});
