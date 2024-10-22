import { defineConfig } from 'tsup';

const cfg = {
  target: 'es2023',
  entry: ['src/index.ts'],
  splitting: false,
  clean: true,
  banner: { js: '// SPDX-License-Identifier: Apache-2.0' },
  cjsInterop: false,
  dts: true,
  format: 'esm',
};

export default defineConfig([
  // @ts-expect-error bruh
  { ...cfg },
  // @ts-expect-error bruh
  { ...cfg, format: 'cjs', dts: false },
]);
