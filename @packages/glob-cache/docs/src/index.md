

_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [globCache](./src/index.js#L40)

A mirror of `globCache.stream` and so an "async generator" function,
returning an AsyncIterable. This mirror exists because it's
a common practice to have a `(globPatterns, options)` signature.

<span id="globcache-signature"></span>

#### Signature

```ts
function(patterns, options)
```

<span id="globcache-params"></span>

#### Params

- `patterns` **{string|Array}** - string or array of glob patterns
- `options` **{object}** - see `globCache.stream` options



<span id="globcache-examples"></span>

#### Examples

```js
const globCache = require('glob-cache');

const iterable = globCache(['src/*.js', 'test/*.{js,ts}'], {
  cwd: './foo/bar'
});

// equivalent to

const iter = globCache.stream({
  include: ['src/*.js', 'test/*.{js,ts}'],
  cwd: './foo/bar'
});
```

### [globCache.stream](./src/index.js#L84)

Match files and folders with glob patterns, by default using [fast-glob's `.stream()`](https://ghub.now.sh/fast-glob).
This function is [async generator](https://javascript.info/async-iterators-generators)
and returns "async iterable", so you can use the `for await ... of` loop. Note that this loop
should be used inside an `async function`.
Each item is a [Context](#context-and-how-it-works) object, which is also passed to each hook.

<span id="globcache.stream-signature"></span>

#### Signature

```ts
function(options)
```

<span id="globcache.stream-params"></span>

#### Params

- `options.cwd` **{string}** - working directory, defaults to `process.cwd()`
- `options.include` **{string|Array}** - string or array of string glob patterns
- `options.patterns` **{string|Array}** - alias of `options.include`
- `options.exclude` **{string|Array}** - ignore glob patterns, passed to `options.globOptions.ignore`
- `options.ignore` **{string|Array}** - alias of `options.exclude`
- `options.hooks` **{object}** - an object with hooks functions, each hook passed with [Context](#context-and-how-it-works)
- `options.hooks.found` **{Function}** - called when a cache for a file is found
- `options.hooks.notFound` **{Function}** - called when file is not found in cache (usually the first hit)
- `options.hooks.changed` **{Function}** - called always when source file differs the cache file
- `options.hooks.notChanged` **{Function}** - called when both source file and cache file are "the same"
- `options.hooks.always` **{Function}** - called always, no matter of the state
- `options.glob` **{Function}** - a function `(patterns, options) => {}` or globbing library like [glob][], [globby][], [fast-glob][]
- `options.globOptions` **{object}** - options passed to the `options.glob` library
- `options.cacheLocation` **{string}** - a filepath location of the cache, defaults to `.cache/glob-cache` in `options.cwd`
- `returns` **{AsyncIterable}**



<span id="globcache.stream-examples"></span>

#### Examples

```js
const globCache = require('glob-cache');

(async () => {
  // Using the Stream API
  const iterable = globCache.stream({
    include: 'src/*.js',
    cacheLocation: './foo-cache'
  });

  for await (const ctx of iterable) {
    console.log(ctx);
  }
})();
```

### [globCache.promise](./src/index.js#L243)

Using the Promise API allows you to use the Hooks API, and it's actually
the recommended way of using the hooks api. By default, if the returned promise
resolves, it will be an empty array. That's intentional, because if you are
using the hooks api it's unnecessary to pollute the memory putting huge objects
to a "result array". So if you want results array to contain the Context objects
you can pass `buffered: true` option.

<span id="globcache.promise-signature"></span>

#### Signature

```ts
function(options)
```

<span id="globcache.promise-params"></span>

#### Params

- `options` **{object}** - see `globCache.stream` options, in addition here we have `options.buffered` too
- `options.buffered` **{boolean}** - if `true` returned array will contain [Context]((#context-and-how-it-works)) objects, default `false`
- `returns` **{Promise}** - if `options.buffered: true` resolves to `Array<Context>`, otherwise empty array



<span id="globcache.promise-examples"></span>

#### Examples

```js
const globCache = require('glob-cache');
const globby = require('globby');

(async () => {
  // Using the Hooks API and `globby.stream`
  const res = await globCache.promise({
    include: 'src/*.js',
    cacheLocation: './.cache/awesome-cache',
    glob: globby.stream,
    hooks: {
      changed(ctx) {},
      always(ctx) {},
    }
  });
  console.log(res); // => []

  // Using the Promise API
  const results = await globCache.promise({
    include: 'src/*.js',
    exclude: 'src/bar.js',
    buffered: true,
  });

  console.log(results); // => [Context, Context, ...]
})();
```

