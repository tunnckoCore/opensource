/*!
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 * 
 * Copyright (c) 2014 Charlike Mike Reagent, Daryl Lau, contributors.
 * Released under the MIT license.
 */

'use strict';

/*!
 * Module dependencies.
 */

var log     = console.log,
    app     = require('koa')(),
    koaBody = require('../index'),
    port    = process.env.PORT || 4290,
    host    = 'http://localhost';


app
  .use(koaBody({
    multipart: true,
    formLimit: 15,
    formidable: {
      uploadDir: __dirname + '/uploads'
    }
  }))
  .use(function *(next) {
    if (this.request.method === 'POST') {
      log(this.request.body);
      // => POST body object
      this.body = JSON.stringify(this.request.body, null, 2);
    }
    yield next;
  })
  .listen(port);


log('Visit %s:%s/ in browser.', host, port);
log();
log('Test with executing this commands:');
log('curl -i %s:%s/whatever -d "name=charlike"', host, port);
log('curl -i %s:%s/whatever -d "name=some-long-name-for-error"', host, port);
log('curl -i %s:%s/whatever -F "source=@%s/avatar.png"', host, port, __dirname);
log();
log('Press CTRL+C to stop...');
