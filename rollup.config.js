'use strict'

const buble = require('rollup-plugin-buble')
const uglify = require('rollup-plugin-uglify')

module.exports = {
  entry: './src/index.js',
  moduleName: 'gibon',
  sourceMap: true,
  plugins: [
    buble(),
    uglify({ compress: { warnings: false } })
  ],
  targets: [
    { dest: 'dist/gibon.iife.js', format: 'iife' },
    { dest: 'dist/gibon.umd.js', format: 'umd' }
  ]
}
