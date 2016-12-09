'use strict'

const Suite = require('benchmarked')
const suite = new Suite({
  cwd: __dirname,
  fixtures: 'fixtures/*.js',
  code: 'code/*.js'
})

suite.run()
