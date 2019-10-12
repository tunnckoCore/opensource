/* eslint-disable require-yield */
/*!
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 *
 * Copyright (c) 2014-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

import request from 'supertest';
import koa from 'koa';
import betterBody from '../src';

const app = koa().use(betterBody());

test('should get the raw text body', async () => {
  app.use(function* sasa() {
    expect(this.request.fields).toBeUndefined();
    expect(this.request.body).toStrictEqual('message=lol');
    this.body = this.request.body;
  });

  await request(app.callback())
    .post('/')
    .type('text')
    .send('message=lol')
    .expect(200)
    .expect('message=lol');
});

test('should throw if the body is too large', async () => {
  const server = koa().use(betterBody({ textLimit: '2b' }));

  await request(server.callback())
    .post('/')
    .type('text')
    .send('foobar')
    .expect(413);
});
