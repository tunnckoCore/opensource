import { defineConfig } from 'tsup';

const cfg = {
  target: 'es2023',
  entry: ['src/index.ts', 'src/header.ts', 'src/commit.ts', 'src/utils.ts'],
  splitting: false,
  clean: true,
  banner: { js: '// SPDX-License-Identifier: MPL-2.0' },
  cjsInterop: false,
  dts: true,
  format: 'esm',
};

// @ts-expect-error bro...
export default defineConfig([{ ...cfg }, { ...cfg, format: 'cjs', dts: false }]);
