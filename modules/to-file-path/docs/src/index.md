_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [toFilePath](./src/index.js#L23)

Create filepath from different type of arguments.

<span id="tofilepath-signature"></span>

#### Signature

```ts
function(args)
```

<span id="tofilepath-params"></span>

#### Params

- `...args` **{string|array|Arguments|number|boolean}** - Pass any type and any
  number of arguments.
- `returns` **{string}** - always slash separated filepath

<span id="tofilepath-examples"></span>

#### Examples

```js
const toFilePath = require('to-file-path');

console.log(toFilePath('foo.bar.baz')); // => 'foo/bar/baz'
console.log(toFilePath('foo.bar', 'qux.baz', 'xxx')); // => 'foo/bar/qux/baz/xxx'
console.log(toFilePath('foo', 'qux', 'baz')); // => 'foo/qux/baz'
console.log(toFilePath([1, 2, 3], 'foo', 4, 'bar')); // => '1/2/3/foo/4/bar'
console.log(toFilePath(null, true)); // => 'null/true'
console.log(toFilePath(1, 2, 3)); // => '1/2/3'
```
