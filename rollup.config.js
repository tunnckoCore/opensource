import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import zopfli from 'rollup-plugin-zopfli'

export default {
  entry: 'src/index.js',
  moduleName: 'gibon',
  useStrict: false,
  // sourceMap: true,
  plugins: [
    buble(),
    uglify({ compress: { warnings: false } }),
    zopfli({ options: { numiterations: 1000 } })
  ],
  targets: [
    { dest: 'dist/gibon.iife.js', format: 'iife' },
    { dest: 'dist/gibon.umd.js', format: 'umd' }
  ]
}
