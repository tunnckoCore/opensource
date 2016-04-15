'use strict'

var app = require('koa')()
var path = require('path')
var IncomingForm = require('formidable')
var body = require('../../index')

var form = new IncomingForm()

form.keepExtensions = true
form.encoding = 'utf-8'
form.uploadDir = path.join(__dirname, 'uploads')

form.on('field', function (name, value) {
  console.log(name, value) // name is user, value is test
})
form.on('file', function (name, file) {
  console.log(name) // => foo
  console.log(file) // => README.md
  console.log(file.path) // => full filepath to where is uploaded
})
form.on('end', function (name, file) {
  console.log('finish parse')
})

app
  .use(body({
    IncomingForm: form
  }))
  .use(function * () {
    console.log(this.body.user) // => test
    console.log(this.request.files) // or `this.body.files`
    console.log(this.body.files.foo.name) // => README.md
    console.log(this.body.files.foo.path) // => full filepath to where is uploaded
  })

app.listen(4290, function () {
  console.log('Koa server start listening on port 4290')
  console.log('curl -i http://localhost:4290/ -F "foo=@%s/README.md" -F user=test', __dirname)
})
