import gzip from 'rollup-plugin-gzip'
import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'

const name = 'gibon'
let config = {
  entry: 'src/index.js'
}

if (process.env.BROWSER) {
  config = Object.assign(config, {
    dest: `dist/${name}.umd.js`,
    format: 'umd',
    moduleName: 'gibon',
    useStrict: false,
    sourceMap: true,
    plugins: [
      buble({
        target: {
          ie: '10',
          edge: '12',
          safari: '8',
          chrome: '48',
          firefox: '44'
        }
      }),
      uglify({ compress: { warnings: false } }),
      gzip()
    ]
  })
} else {
  config = Object.assign(config, {
    plugins: [
      buble({
        target: { node: '4' }
      })
    ],
    targets: [
      { dest: `dist/${name}.es.js`, format: 'es' },
      { dest: `dist/${name}.common.js`, format: 'cjs' }
    ]
  })
}

export default config
