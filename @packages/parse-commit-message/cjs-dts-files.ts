import fs from 'node:fs/promises';
import path from 'node:path';
import proc from 'node:process';

const cwd = proc.cwd();
const ctsDtsFiles = (await fs.readdir('./dist'))
  .filter((x) => x.endsWith('.d.ts'))
  .map((x) => path.join(cwd, 'dist', x.replace('.ts', '.cts')));

for await (const outfile of ctsDtsFiles) {
  // console.log(outfile, path.basename(outfile).replace('cts', 'ts'));
  const regularDtsFile = path.basename(outfile).replace('cts', 'ts');
  await Bun.write(outfile, `export * from './${regularDtsFile}';`);
}
