'use strict';

const app = require('koa')();
const route = require('koa-route');
const body = require('../../src/index');

const controller = {
  *home(next) {
    this.body = `<form action="/" method="post" enctype="multipart/form-data">
        <input type="file" name="img" multiple="multiple">
        <input type="input" name="foo">
        <input type="input" name="bar">
        <input type="input" name="baz[qux][aa]">
        <input type="input" name="baz[qux][bb]">
        <button>Upload</button>
    </form>`;
  },
  *upload(next) {
    this.body = JSON.stringify(
      {
        files: this.request.files,
        fields: this.request.fields,
      },
      null,
      2,
    );
  },
};

app.use(
  body({
    querystring: require('qs'),
    formLimit: '6mb',
  }),
);
app.use(route.get('/', controller.home));
app.use(route.post('/', controller.upload));
app.listen(4290);
