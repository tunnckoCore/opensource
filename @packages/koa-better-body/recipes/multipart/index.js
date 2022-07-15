'use strict';

const app = require('koa')();
const path = require('path');
const body = require('../../src/index');

app
  .use(
    body({
      encoding: 'utf-8',
      uploadDir: path.join(__dirname, 'uploads'),
      keepExtensions: true,
    }),
  )
  .use(function* () {
    console.log(this.request.files); // or `this.body.files`
    console.log(this.body.files.foo.name); // => README.md
    console.log(this.body.files.foo.path); // => full filepath to where is uploaded
  });

app.listen(4290, () => {
  console.log('Koa server start listening on port 4290');
  console.log(
    'curl -i http://localhost:4290/ -F "foo=@%s/README.md"',
    __dirname,
  );
});
