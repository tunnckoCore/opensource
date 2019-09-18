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

test('should catch errors through `options.onerror`', async () => {
  const server = koa().use(
    betterBody({
      onerror(err, ctx) {
        test.ifError(!err);
        test.strictEqual(err.status, 400);
        ctx.throw('custom error', 422);
      },
    }),
  );

  await promisify(
    request(server.callback())
      .post('/')
      .type('json')
      .send('"foobar"')
      .expect(422)
      .expect('custom error').end,
  )();
});
test('should treat `foo/y-javascript` type as json', async () => {
  const server = koa().use(
    betterBody({
      extendTypes: {
        json: 'foo/y-javascript',
      },
    }),
  );
  server.use(function* sasa() {
    test.strictEqual(typeof this.request.fields, 'object');
    test.strictEqual(this.request.fields.a, 'b');
    this.body = this.request.fields;
  });

  await promisify(
    request(server.callback())
      .post('/')
      .type('foo/y-javascript')
      .send(JSON.stringify({ a: 'b' }))
      .expect(200)
      .expect({ a: 'b' }).end,
  )();
});
test('should get body on `strict:false` and DELETE request with body', async () => {
  const server = koa()
    .use(betterBody({ strict: false }))
    .use(function* postBody() {
      this.body = this.request.fields;
    });

  await promisify(
    request(server.callback())
      .delete('/')
      .type('json')
      .send({ abc: 'foo' })
      .expect(200)
      .expect({ abc: 'foo' }).end,
  )();
});
test('should not get body on DELETE request (on strict mode)', async () => {
  const server = koa().use(betterBody());
  server.use(function* sasa() {
    test.strictEqual(this.body, undefined);
    test.strictEqual(this.request.fields, undefined);
    this.status = 204;
  });

  await promisify(
    request(server.callback())
      .delete('/')
      .type('text')
      .send('foo bar')
      .expect(204).end,
  )();
});
test('should accept opts.extendTypes.custom `foo/bar-x` as text', async () => {
  let app = koa().use(
    betterBody({
      extendTypes: {
        custom: ['foo/bar-x'],
      },
      handler: function* handler(ctx, opts) {
        test.strictEqual(typeof ctx, 'object');
        test.strictEqual(typeof this, 'object');
        test.strictEqual(typeof ctx.request.text, 'function');
        test.strictEqual(typeof this.request.text, 'function');

        this.request.body = yield this.request.text(opts);
      },
    }),
  );

  app = app
    .use(function* sasa(next) {
      test.strictEqual(typeof this.request.body, 'string');
      test.strictEqual(this.request.body, 'message=lol');
      this.body = this.request.body;
      yield* next;
    })
    .use(function* sasa() {
      test.strictEqual(this.body, 'message=lol');
    });

  await promisify(
    request(app.callback())
      .post('/')
      .type('foo/bar-x')
      .send('message=lol')
      .expect(200)
      .expect('message=lol').end,
  )();
});

test('should parse bodies using custom `opts.querystring` module', async () => {
  const app = koa().use(
    betterBody({
      // eslint-disable-next-line global-require
      querystring: require('qs'),
    }),
  );
  app.use(function* sasa() {
    test.strictEqual(typeof this.request.fields, 'object');
    test.deepEqual(this.request.fields, { a: { b: { c: '1' } }, c: '2' });
    this.body = JSON.stringify(this.request.fields);
  });

  await promisify(
    request(app.callback())
      .post('/')
      .type('application/x-www-form-urlencoded')
      .send('a[b][c]=1&c=2')
      .expect(/{"a":{"b":{"c":"1"/)
      .expect(/"c":"2"}/)
      .expect(200).end,
  )();
});
