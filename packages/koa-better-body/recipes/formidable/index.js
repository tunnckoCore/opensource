'use strict';

const app = require('koa')();
const path = require('path');
const IncomingForm = require('formidable');
const body = require('../../src/index');

const form = new IncomingForm();

form.keepExtensions = true;
form.encoding = 'utf-8';
form.uploadDir = path.join(__dirname, 'uploads');

form.on('field', (name, value) => {
  console.log(name, value); // name is user, value is test
});
form.on('file', (name, file) => {
  console.log(name); // => foo
  console.log(file); // => README.md
  console.log(file.path); // => full filepath to where is uploaded
});
form.on('end', (name, file) => {
  console.log('finish parse');
});

app
  .use(
    body({
      IncomingForm: form,
    }),
  )
  .use(function*() {
    console.log(this.body.user); // => test
    console.log(this.request.files); // or `this.body.files`
    console.log(this.body.files.foo.name); // => README.md
    console.log(this.body.files.foo.path); // => full filepath to where is uploaded
  });

app.listen(4290, () => {
  console.log('Koa server start listening on port 4290');
  console.log(
    'curl -i http://localhost:4290/ -F "foo=@%s/README.md" -F user=test',
    __dirname,
  );
});
