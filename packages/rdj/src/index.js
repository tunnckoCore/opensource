import fs from 'fs';
import path from 'path';
import commonjs from 'rollup-plugin-commonjs';
import importMap from 'rollup-plugin-esm-import-to-url';
// import { terser } from 'rollup-plugin-terser';
// import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
// import replace from 'rollup-plugin-replace';
import typescript from '@wessberg/rollup-plugin-ts';

import ky from 'ky-universal';

const { dependencies } = JSON.parse(
  fs.readFileSync('./example/package.json', 'utf8'),
);

// commonjs
// json
// babel
// importmap
export default async function rdj() {
  return {
    input: './example/index.ts',
    output: {
      file: './dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
      preferConst: true,
      inlineDynamicImports: true,
      experimentalTopLevelAwait: true,
    },
    plugins: [
      commonjs(),
      json(),
      typescript({
        transpiler: 'typescript',
        tsconfig: path.resolve(__dirname, '..', '..', '..', 'tsconfig.json'),
      }),
      // importMap(
      //   Object.keys(dependencies).reduce(async (acc, name) => {

      //     acc[name] = `https://unpkg.com/`;
      //     return acc;
      //   }, {}),
      // ),
    ],
  };
}

// 1. if you write Node (ts) and target is browser, rewrite to unpkg ?module (esm)
// 2. if you write Node (ts) and target is commonjs, leave the bare specifiers
// 3. if you write Deno (ts) and target is browser, rewrite to unpkg ?module (esm)
// 4. if you write Deno (ts) and target is deno, allow loading unpkg path to src/mod.ts

async function main() {
  Object.keys(dependencies).reduce(async (acc, name) => {
    const dep = dependencies[name].slice(1);
    acc[name] = `https://unpkg.com/${name}@${dep}?module`;

    return acc;
  }, {});
}

main();
