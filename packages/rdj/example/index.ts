/* eslint-disable */

import add from './add';

export function str(xyz: string): string {
  console.log(add(33, 21));

  return `foobar=${xyz}`;
}

export { add };
