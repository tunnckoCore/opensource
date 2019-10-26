import arrIncludes from '../src';

test('should return true if the value exists in the array.', async () => {
  const fixture = ['a', 'b', 'bar', 'qux', 'f', 'g'];
  expect(arrIncludes(fixture, 'foo')).toStrictEqual(false);
  expect(arrIncludes(['true', 'qqq', 'bar'], true)).toStrictEqual(false);
  expect(arrIncludes([true, 'qqq', 'bar'], true)).toStrictEqual(true);
});

test('should return true if any of values exists in array', async () => {
  expect(arrIncludes([1, 'bar', 3], 2)).toStrictEqual(false);
  expect(arrIncludes([1, 'bar', 3], 3)).toStrictEqual(2);
  expect(arrIncludes([1, 'bar', 3], ['foo', 'qq', 3])).toStrictEqual(2);
  expect(arrIncludes(['foo', 'bar', 'baz'], ['foo', 'qux'])).toStrictEqual(
    true,
  );
});

test('should return false if any of values not exists in array', async () => {
  const fixture = ['foo', 'bar', 'baz'];
  const actual = arrIncludes(fixture, ['aaa', 'bbb']);
  expect(actual).toStrictEqual(false);
});

test('should not blow up on empty arrays', async () => {
  const fixture = [];
  const actual = arrIncludes(fixture, 'd');
  expect(actual).toStrictEqual(false);
});

test('should not blow up on null', async () => {
  const actual = arrIncludes(null, 'd');
  expect(actual).toStrictEqual(false);
});

test('should not blow up when no value is passed', async () => {
  const actual = arrIncludes(null);
  expect(actual).toStrictEqual(false);
});

test('should return `true` if match with index zero', async () => {
  expect(arrIncludes(['foo', 'bar', 3], 'foo')).toStrictEqual(true);
});

test('should return the index of the match', async () => {
  const res1 = arrIncludes(['foo', 'bar', 3], 'bar');
  const res2 = arrIncludes(['foo', 444, 'ab', 3], 'ab');
  const res3 = arrIncludes(['foo', false, 'qux', 3], false);
  const res4 = arrIncludes(['foo', 11, 'qux', 'last'], 'last');

  expect(res1).toStrictEqual(1);
  expect(res2).toStrictEqual(2);
  expect(res3).toStrictEqual(1);
  expect(res4).toStrictEqual(3);
});
