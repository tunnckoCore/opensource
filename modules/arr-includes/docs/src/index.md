_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [arrIncludes](./src/index.js#L33)

Check if any of `values` exists on `arr`.

<span id="arrincludes-signature"></span>

#### Signature

```ts
function(arr, values)
```

<span id="arrincludes-params"></span>

#### Params

- `arr` **{Array}** - array to check
- `values` **{Array&lt;string&gt;}** - array or string
- `returns` **{boolean|number}** - returns `false` if not found, `true` if
  **index is 0** from the array, otherwise `number` index

<span id="arrincludes-examples"></span>

#### Examples

```js
import arrIncludes from 'arr-includes';

console.log(arrIncludes([1, 'bar', 55], 2)); // => false
console.log(arrIncludes([1, 'bar', 3], 3)); // => 2

console.log(arrIncludes([1, 'bar', 3, true], false)); // => false
console.log(arrIncludes([1, 'bar', 44, true], true)); // => 3

console.log(arrIncludes(['foo', 'bar'], 'baz')); // => false
console.log(arrIncludes(['foo', 'bar'], 'foo')); // => true
console.log(arrIncludes(['qux', 'foo', 'bar'], 'foo')); // => 1
console.log(arrIncludes([true, 'qqq', 'bar'], true)); // => true
console.log(arrIncludes(['true', 'qqq', 'bar'], true)); // => false
console.log(arrIncludes(['qqq', 'bar', true], true)); // => 2
console.log(arrIncludes(['qqq', 'true', 'bar'], true)); // => false
console.log(arrIncludes([false, 'foo', null, 'bar'], null)); // => 2

console.log(arrIncludes(['foo', 'bar', 'qux'], ['a', 'b', 'c'])); // => false
console.log(arrIncludes(['b', 'a', 'c'], ['a', 'b', 'c'])); // => 1
console.log(arrIncludes(['foo', 'bb', 'b'], ['a', 'b'])); // => 2
console.log(arrIncludes(['foo', 'bar', 'qux'], ['a', 'b', 'foo'])); // => true
console.log(arrIncludes(['bar', 123, 'foo', 'qux'], ['a', 'b', 'foo'])); // => 2
```
