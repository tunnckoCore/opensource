/* eslint-disable jest/expect-expect */
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

function postBody() {
  return function* sasa(next) {
    this.body = this.request.fields;
    yield* next;
  };
}

test('should parse a json body', async () => {
  const server = koa()
    .use(betterBody())
    .use(postBody());

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .send({ foo: 'lol' })
      .expect(200)
      .expect({ foo: 'lol' })
      .end((err) => (err ? reject(err) : resolve()));
  });
});

test('should parse a string json body', async () => {
  const server = koa()
    .use(betterBody())
    .use(postBody());

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('application/json')
      .send('{"fao":"nato"}')
      .expect(200)
      .expect({ fao: 'nato' })
      .end((err) => (err ? reject(err) : resolve()));
  });
});

test('should throw on json non-object body in strict mode (default)', async () => {
  const server = koa()
    .use(betterBody())
    .use(postBody());

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('json')
      .send('"lol"')
      .expect(400)
      .end((err) => (err ? reject(err) : resolve()));
  });
});

test('should not throw on non-objects in non-strict mode', async () => {
  const server = koa()
    .use(betterBody({ jsonStrict: false }))
    .use(postBody());

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('json')
      .send('"foobar"')
      .expect(200)
      .expect(/foobar/)
      .end((err) => (err ? reject(err) : resolve()));
  });
});
