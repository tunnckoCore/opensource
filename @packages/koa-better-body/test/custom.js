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
		.use(function* abc(next) {
			expect(this.request.body).toStrictEqual('message=lol');
			this.body = this.request.body;
			yield* next;
		})
		// eslint-disable-next-line require-yield
		.use(function* abc() {
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
