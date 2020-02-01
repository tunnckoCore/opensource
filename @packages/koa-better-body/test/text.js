/* eslint-disable jest/expect-expect */
/* eslint-disable require-yield */

/*!
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 *
 * Copyright (c) 2014-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

import request from 'supertest';
import Koa from 'koa';
import betterBody from '../src/index';

function koa() {
  return new Koa();
}

test('should get the raw text body', async () => {
  const server = koa()
    .use(betterBody())
    .use(function* sasa() {
      expect(this.request.fields).toBeUndefined();
      expect(this.request.body).toStrictEqual('message=lol');
      this.body = this.request.body;
    });

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('text')
      .send('message=lol')
      .expect(200)
      .expect('message=lol')
      .end((err) => (err ? reject(err) : resolve()));
  });
});

test('should throw if the body is too large', async () => {
  const server = koa().use(betterBody({ textLimit: '2b' }));

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('text')
      .send('foobar')
      .expect(413)
      .end((err) => (err ? reject(err) : resolve()));
  });
});
