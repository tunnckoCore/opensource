import { validateHeader } from '../../src/header.js';

test('.validateHeader should return { error }', () => {
  const res = validateHeader({ type: 'fix' });

  expect(res.error).toBeTruthy();
  expect(res.value).toBeFalsy();
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
