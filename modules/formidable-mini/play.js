import fs from 'node:fs';
import split from 'split2';

const lines = fs.createReadStream('./fixture.js').pipe(split());

for await (const line of lines) {
  console.log('>>>>>>', line, '<<<<<<<<<<<<');
}
