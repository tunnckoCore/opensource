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

test('should catch errors through `options.onerror`', async () => {
  const server = koa().use(
    betterBody({
      onerror(err, ctx) {
        expect(err).toBeTruthy();
        expect(err.status).toStrictEqual(400);
        ctx.throw('custom error', 422);
      },
    }),
  );

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('json')
      .send('"foobar"')
      .expect(422)
      .expect('custom error')
      .end((err) => (err ? reject(err) : resolve()));
  });
});

test('should treat `foo/y-javascript` type as json', async () => {
  const server = koa()
    .use(
      betterBody({
        extendTypes: {
          json: 'foo/y-javascript',
        },
      }),
    )
    .use(function* postBody() {
      expect(this.request.fields).toMatchObject({ a: 'bbb' });
      this.body = this.request.fields;
    });

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('foo/y-javascript')
      .send(JSON.stringify({ a: 'bbb' }))
      .expect(200)
      .expect({ a: 'bbb' })
      .end((err) => (err ? reject(err) : resolve()));
  });
});

test('should get body on `strict:false` and DELETE request with body', async () => {
  const server = koa()
    .use(betterBody({ strict: false }))
    .use(function* postBody() {
      this.body = this.request.fields;
    });

  await new Promise((resolve, reject) => {
    request(server.callback())
      .delete('/')
      .type('json')
      .send({ abc: 'foo' })
      .expect(200)
      .expect({ abc: 'foo' })
      .end((err) => (err ? reject(err) : resolve()));
  });
});

test('should not get body on DELETE request (on strict mode)', async () => {
  const server = koa().use(betterBody());
  server.use(function* sasa() {
    expect(this.body).toBeUndefined();
    expect(this.request.fields).toBeUndefined();
    this.status = 204;
  });

  await new Promise((resolve, reject) => {
    request(server.callback())
      .delete('/')
      .type('text')
      .send('foo bar')
      .expect(204)
      .end((err) => (err ? reject(err) : resolve()));
  });
});

test('should accept opts.extendTypes.custom `foo/bar-x` as text', async () => {
  const server = koa()
    .use(
      betterBody({
        extendTypes: {
          custom: ['foo/bar-x'],
        },
        handler: function* handler(ctx, opts) {
          expect(typeof ctx).toStrictEqual('object');
          expect(typeof this).toStrictEqual('object');
          expect(typeof ctx.request.text).toStrictEqual('function');
          expect(typeof this.request.text).toStrictEqual('function');

          this.request.body = yield this.request.text(opts);
        },
      }),
    )

    .use(function* sasa(next) {
      expect(typeof this.request.body).toStrictEqual('string');
      expect(this.request.body).toStrictEqual('message=lol');
      this.body = this.request.body;
      yield* next;
    })
    .use(function* sasa() {
      expect(this.body).toStrictEqual('message=lol');
    });

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('foo/bar-x')
      .send('message=lol')
      .expect(200)
      .expect('message=lol')
      .end((err) => (err ? reject(err) : resolve()));
  });
});

test('should parse bodies using custom `opts.querystring` module', async () => {
  const server = koa()
    .use(
      betterBody({
        // eslint-disable-next-line global-require
        querystring: require('qs'),
      }),
    )
    .use(function* sasa() {
      expect(this.request.fields).toMatchObject({
        a: {
          b: {
            c: '1',
          },
        },
        c: '2',
      });
      this.body = JSON.stringify(this.request.fields);
    });

  await new Promise((resolve, reject) => {
    request(server.callback())
      .post('/')
      .type('application/x-www-form-urlencoded')
      .send('a[b][c]=1&c=2')
      .expect(/{"a":{"b":{"c":"1"/)
      .expect(/"c":"2"}/)
      .expect(200)
      .end((err) => (err ? reject(err) : resolve()));
  });
});
