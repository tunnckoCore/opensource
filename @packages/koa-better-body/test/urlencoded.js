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
import betterBody from '../src/index.js';

function koa() {
  return new Koa();
}

test('should parse a urlencoded body', async () => {
  const server = koa()
    .use(betterBody())
    .use(function* sasa() {
      expect(this.request.fields).toMatchObject({ a: 'b', c: 'd' });
      this.body = this.request.fields;
    });

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('application/x-www-form-urlencoded')
      .send('a=b&c=d')
      .expect(200)
      .expect(/"a":"b"/)
      .expect(/"c":"d"/)
      .end((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
  });
});

test('should throw if the body is too large', async () => {
  const server = koa().use(betterBody({ formLimit: '2b' }));

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('application/x-www-form-urlencoded')
      .send({ foo: { bar: 'qux' } })
      .expect(413)
      .end((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
  });
});

test('should parse a nested body when `app.querystring` passed', async () => {
  const server = koa();
  // eslint-disable-next-line global-require
  server.querystring = require('qs');

  server.use(betterBody({ formLimit: '2mb' })).use(function* sasa() {
    expect(this.request.fields).toMatchObject({
      foo: {
        bar: {
          baz: 'qux',
          cc: 'ccc',
        },
        aa: 'bb',
      },
    });
    this.body = JSON.stringify(this.request.fields);
  });

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('application/x-www-form-urlencoded')
      .send('foo[bar][baz]=qux&foo[bar][cc]=ccc&foo[aa]=bb')
      .expect(/"foo":{"bar":/)
      .expect(/"baz":"qux","cc":"ccc"}/)
      .expect(/"aa":"bb"}}/)
      .expect(200)
      .end((err) => (err ? reject(err) : resolve()));
  });
});
