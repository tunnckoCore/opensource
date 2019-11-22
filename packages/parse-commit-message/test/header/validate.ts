/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable import/extensions */

import { validateHeader } from '../../src/header';

test('.validateHeader should return { error }', () => {
  // @ts-ignore
  const res = validateHeader({ type: 'fix' });

  expect(res.error).toBeTruthy();
  expect(res.value).toBeFalsy();

  // ? how the heck we can get rid of such reports by TypeScript?
  // ? I know that in that point in time and that specific case
  // ? the `res.error` won't be undefined... wtf.

  // @ts-ignore
  expect(res.error.message).toMatch(
    /header\.subject should be non empty string/,
  );
});

test('.validateHeader should return { value }', () => {
  const result = validateHeader({ type: 'fix', subject: 'bar qux' });
  expect(result).toMatchObject({
    value: { type: 'fix', scope: null, subject: 'bar qux' },
  });
});
