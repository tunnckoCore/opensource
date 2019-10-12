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

test('should parse a urlencoded body', async () => {
  const app = koa().use(betterBody());
  app.use(function* sasa() {
    expect(this.request.fields).toMatchObject({ a: 'b', c: 'd' });
    this.body = this.request.fields;
  });

  await request(app.callback())
    .post('/')
    .type('application/x-www-form-urlencoded')
    .send('a=b&c=d')
    .expect(200)
    .expect(/"a":"b"/)
    .expect(/"c":"d"/);
});

test('should throw if the body is too large', async () => {
  const app = koa().use(betterBody({ formLimit: '2b' }));

  await request(app.callback())
    .post('/')
    .type('application/x-www-form-urlencoded')
    .send({ foo: { bar: 'qux' } })
    .expect(413);
});

test('should parse a nested body when `app.querystring` passed', async () => {
  const app = koa();
  // eslint-disable-next-line global-require
  app.querystring = require('qs');

  app.use(betterBody({ formLimit: '2mb' }));
  app.use(function* sasa() {
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

  await request(app.callback())
    .post('/')
    .type('application/x-www-form-urlencoded')
    .send('foo[bar][baz]=qux&foo[bar][cc]=ccc&foo[aa]=bb')
    .expect(/"foo":{"bar":/)
    .expect(/"baz":"qux","cc":"ccc"}/)
    .expect(/"aa":"bb"}}/)
    .expect(200);
});
