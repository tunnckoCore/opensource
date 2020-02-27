_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [globCache](./src/index.js#L48)

Match files and folders using glob patterns. Returns a resolved Promise
containing a `{ results, cacache }` object - where `results` is an array of
[Context](#context-and-how-it-works) objects and `cacache` is the [cacache][]
package.

<span id="globcache-signature"></span>

#### Signature

```ts
function(options)
```

<span id="globcache-params"></span>

#### Params

- `options.include` **{Array&lt;string&gt;}** - string or array of string glob
  patterns
- `options.exclude` **{string}** - ignore patterns
- `options.always` **{boolean}** - a boolean that makes `options.hook` to always
  be called
- `options.hook` **{Function}** - a hook function passed with
  [Context](#context-and-how-it-works)
- `options.glob` **{Function}** - a globbing library like [glob][], [globby][],
  [fast-glob][], [tiny-glob][], defaults to `fast-glob`
- `options.globOptions` **{object}** - options passed to the `options.glob`
  library
- `options.cacheLocation` **{string}** - a filepath location of the cache,
  defaults to `./.cache/glob-cache`
- `returns` **{Promise}**

<span id="globcache-examples"></span>

#### Examples

```js
const tinyGlob = require('tiny-glob');
const glob = require('glob-cache');

glob({ include: 'src/*.js', glob: tinyGlob }).then(({ results }) => {
  console.log(results);
});
```
