'use strict'

var Suite = require('benchmarked')
var suite = new Suite({
  fixtures: 'fixtures/*.txt',
  add: 'code/*.js',
  cwd: __dirname
})

suite.run()
