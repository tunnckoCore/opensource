/**!
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 *
 * Copyright (c) 2014 Charlike Mike Reagent, Daryl Lau, contributors.
 * Released under the MIT license.
 */

'use strict';

/**
 * Module dependencies.
 */

var log = console.log;
var app = require('koa')();
var koaBody = require('../index');
var fmt = require('util').format;
var port = process.env.PORT || 4290;
var host = 'http://localhost';

app
  .use(koaBody({
    multipart: true,
    formLimit: 15,
    formidable: {
      uploadDir: __dirname + '/uploads'
    }
  }))
  .use(function * recieveUploads(next) {
    if (this.request.method === 'POST') {
      log(this.request.body);
      // => POST body object
      this.body = JSON.stringify(this.request.body, null, 2);
    }
    yield next;
  })
  .listen(port);

host = fmt('%s:%s', host, port);

log('Visit %s/ in browser.', host);
log();
log('Test with executing this commands:');
log('curl -i %s/whatever -d "name=charlike"', host);
log('curl -i %s/whatever -d "name=some-long-name-for-error"', host);
log('curl -i %s/whatever -F "source=@%s/avatar.png"', host, __dirname);
log();
log('Press CTRL+C to stop...');
