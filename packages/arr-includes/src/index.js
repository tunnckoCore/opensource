/**
 * Check if any of `values` exists on `arr`.
 *
 * @example
 * import arrIncludes from 'arr-includes';
 *
 * console.log(arrIncludes([1, 'bar', 55], 2)); // => false
 * console.log(arrIncludes([1, 'bar', 3], 3)); // => 2
 *
 * console.log(arrIncludes([1, 'bar', 3, true], false)); // => false
 * console.log(arrIncludes([1, 'bar', 44, true], true)); // => 3
 *
 * console.log(arrIncludes(['foo', 'bar'], 'baz')); // => false
 * console.log(arrIncludes(['foo', 'bar'], 'foo')); // => true
 * console.log(arrIncludes(['qux', 'foo', 'bar'], 'foo')); // => 1
 * console.log(arrIncludes([true, 'qqq', 'bar'], true)); // => true
 * console.log(arrIncludes(['true', 'qqq', 'bar'], true)); // => false
 * console.log(arrIncludes(['qqq', 'bar', true], true)); // => 2
 * console.log(arrIncludes(['qqq', 'true', 'bar'], true)); // => false
 * console.log(arrIncludes([false, 'foo', null, 'bar'], null)); // => 2
 *
 * console.log(arrIncludes(['foo', 'bar', 'qux'], ['a', 'b', 'c'])); // => false
 * console.log(arrIncludes(['b', 'a', 'c'], ['a', 'b', 'c'])); // => 1
 * console.log(arrIncludes(['foo', 'bb', 'b'], ['a', 'b'])); // => 2
 * console.log(arrIncludes(['foo', 'bar', 'qux'], ['a', 'b', 'foo'])); // => true
 * console.log(arrIncludes(['bar', 123, 'foo', 'qux'], ['a', 'b', 'foo'])); // => 2
 *
 * @param  {Array} `arr` array to check
 * @param  {Array|string[]} `values` array or string
 * @return {boolean|number} returns `false` if not found, `true` if **index is 0** from the array, otherwise `number` index
 * @public
 */
export default function arrIncludes(arr, values) {
  if (!Array.isArray(values)) return inArray(arr, values);
  const len = values.length;
  let i = -1;

  // eslint-disable-next-line no-plusplus
  while (i++ < len) {
    const j = inArray(arr, values[i]);
    if (j) {
      return j;
    }
  }

  return false;
}

function inArray(arr, val) {
  const items = [].concat(arr).filter(Boolean);
  const len = items.length;
  let i = null;

  // eslint-disable-next-line no-plusplus
  for (i = 0; i < len; i++) {
    if (arr[i] === val) {
      return i === 0 ? true : i;
    }
  }

  return false;
}
