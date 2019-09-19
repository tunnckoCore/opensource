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

function postBody() {
  return function* sasa(next) {
    this.body = this.request.fields;
    yield* next;
  };
}

const app = koa()
  .use(betterBody())
  .use(postBody());

test('should parse a json body', async () => {
  await promisify(
    request(app.callback())
      .post('/')
      .send({ foo: 'lol' })
      .expect(200)
      .expect({ foo: 'lol' }).end,
  )();
});
test('should parse a string json body', async () => {
  await promisify(
    request(app.callback())
      .post('/')
      .type('application/json')
      .send('{"fao":"nato"}')
      .expect(200)
      .expect({ fao: 'nato' }).end,
  )();
});
test('should throw on json non-object body in strict mode (default)', async () => {
  await promisify(
    request(app.callback())
      .post('/')
      .type('json')
      .send('"lol"')
      .expect(400).end,
  )();
});
test('should not throw on non-objects in non-strict mode', async () => {
  const server = koa()
    .use(betterBody({ jsonStrict: false }))
    .use(postBody());

  await promisify(
    request(server.callback())
      .post('/')
      .type('json')
      .send('"foobar"')
      .expect(200)
      .expect(/foobar/).end,
  )();
});
