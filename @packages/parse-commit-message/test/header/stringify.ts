import { expect, test } from 'bun:test';

import { stringifyHeader } from '../../src/header.ts';

test('.stringifyHeader throw if invalid header is given', () => {
  // @ts-expect-error bruh, yeah, I know it's invalid
  expect(() => stringifyHeader(1234)).toThrow(TypeError);
  // @ts-expect-error bruh, yeah, I know it's invalid
  expect(() => stringifyHeader({ type: 'foo' })).toThrow(TypeError);
  // @ts-expect-error bruh, yeah, I know it's invalid
  expect(() => stringifyHeader()).toThrow(TypeError);
});

test('.stringifyHeader object', () => {
  const header = { type: 'fix', scope: 'huh', subject: 'yeah yeah' };
  const result = stringifyHeader(header);

  expect(result).toStrictEqual('fix(huh): yeah yeah');
});

test('.stringifyHeader object without scope', () => {
  const header = { type: 'fix', subject: 'yeah yeah' };
  const result = stringifyHeader(header);

  expect(result).toStrictEqual('fix: yeah yeah');
});

test('.stringifyHeader simple header object with just { value: string } ', () => {
  const str = stringifyHeader({ value: 'fix(bar): ok ok' });

  expect(str).toStrictEqual('fix(bar): ok ok');
});

test('.stringifyHeader throw when {value} and not valid conventional commit header', () => {
  // ? not sure if it make sense to throw,
  // ? and at all, does such case make any sense...

  expect(() =>
    stringifyHeader({
      value: 'foo bar qux',
    }),
  ).toThrow(TypeError);
});
