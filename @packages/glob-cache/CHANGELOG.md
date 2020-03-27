# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.3](https://github.com/tunnckoCore/opensource/compare/glob-cache@1.0.2...glob-cache@1.0.3) (2020-03-27)

**Note:** Version bump only for package glob-cache





## [1.0.2](https://github.com/tunnckoCore/opensource/compare/glob-cache@1.0.1...glob-cache@1.0.2) (2020-03-27)


### Bug Fixes

* upgrade prettier to v2 ([#131](https://github.com/tunnckoCore/opensource/issues/131)) ([8b9f668](https://github.com/tunnckoCore/opensource/commit/8b9f66828baf27d92ce704f0f3c3c9a706ff39ed))





## [1.0.1](https://github.com/tunnckoCore/opensource/compare/glob-cache@1.0.0...glob-cache@1.0.1) (2020-03-06)


### Bug Fixes

* **glob-cache:** check if info is not null ([24df806](https://github.com/tunnckoCore/opensource/commit/24df806bc32c1d599f0366ea1874acc81789e0c7))





# [1.0.0](https://github.com/tunnckoCore/opensource/compare/glob-cache@0.3.5...glob-cache@1.0.0) (2020-03-05)


### Bug Fixes

* **glob-cache:** include mpl-2.0 license file ([90f1e4e](https://github.com/tunnckoCore/opensource/commit/90f1e4e20ef2660db8e7c6036c2305e20531b50f))


### Features

* **glob-cache:** streaming API, use async iterables under the h… ([#124](https://github.com/tunnckoCore/opensource/issues/124)) ([a77e7f7](https://github.com/tunnckoCore/opensource/commit/a77e7f7a1bd1478500cad9ae36dd5efda528a47a))


### BREAKING CHANGES

* **glob-cache:** use async iterables + expose Stream, Promise, and Hooks APIs

## "Streaming" / async iterables API
Uses `fastGlob.stream` by default, plus `for await ... of`.

The main default export is async generator `async function * () {}` and it returns async iterable, so you need to call `iterable.next()` or to use `for await` loop (which requires `async` function).

```js
const globCache = require('glob-cache');

async function main() {
  const iterable = globCache('src/**/*.js');
  // or like so, both are equivalent
  const iter = globCache.stream({ include: 'src/**/*.js' });

  for await (const ctx of iterable) {
    console.log(ctx);
  }
}

main().catch(console.error);
```

## Promise API

There is also exported `globCache.promise` API, which is `async function` and so returns a Promise.

```js
const globCache = require('glob-cache');

const promise = globCache.promise({ include: 'src/**/*.js' });

promise
  .then((results) => {
    console.log(results); // []
  })
  .catch(console.error);
```

Important to note. By default the Promise API resolves to an empty array. That's intentional since we also have the so-called Hooks API and so it's unnecessary to pollute the memory when you are using this api. If you don't use the Hooks API, but just want the results then pass `buffered: true` and the promise will resolve to an array of Context objects. You can later filter this `results` array of contexts by `ctx.changed` or `ctx.notFound`, or whatever.

```js
const globCache = require('glob-cache');

async function main() {
  const results = await globCache.promise({
    include: 'src/**/*.js',
    buffered: true,
  });

  console.log(results);
  // => [Context, Context, Context, ...]
}

main().catch(console.error);
```

## Hooks API

**It's not recommended to use the Hooks API when using the Stream API.**

Previously we had just a single `options.hook` function, now it is `options.hooks` object. And we needed to determine based on `ctx.valid` and `ctx.missing` booleans. 

Now we just have hooks for everything - `hooks.changed`, `hooks.notChanged`, `hooks.found`, `hooks.notFound` and `hooks.always`. It's pretty obvious by their names. Hooks can also be async functions - using async/await or regular function returning a promise.

The `ctx.valid` and `ctx.missing` are replaced by `ctx.changed` and `ctx.notFound` - both has almost the same meaning as previously. Both are available through all the hooks. In combination with hooks it becomes great.

```
1. on very first hit
  -> ctx.changed === true
  -> ctx.notFound === true
2. on second hit (without changes to files)
  -> ctx.changed === false
  -> ctx.notFound === false
3. on third hit (with changes)
  -> ctx.changed === true
  -> ctx.notFound === false
```

Same as above applies for the hooks calls.

```js
const globCache = require('glob-cache');

(async () => {

await globCache.promise({
  include: 'src/*.js',
  hooks: {
    changed(ctx) {
      if (ctx.notFound) {
        console.log(ctx.file.path, 'first hit');
      } else {
        console.log(ctx.file.path, 'changed');
      }
    },
    always() {
      console.log('file', ctx.file.path);
    },
  },
});

})()
```

Notice that `changed` hook is also called when "not found" (i.e. first hit).

Signed-off-by: Charlike Mike Reagent <opensource@tunnckocore.com>





## [0.3.5](https://github.com/tunnckoCore/opensource/compare/glob-cache@0.3.4...glob-cache@0.3.5) (2020-02-29)


### Bug Fixes

* switch to latest memoize-fs; update deps; re-run docs; ([ab08601](https://github.com/tunnckoCore/opensource/commit/ab086010ad49091b3d25874ba7c207c85dfa8ff9))
* **glob-cache:** add missing docs ([9ebfa7d](https://github.com/tunnckoCore/opensource/commit/9ebfa7d48860af5ef3ea3977fb2e3256148ea2b7))





## [0.3.4](https://github.com/tunnckoCore/opensource/compare/glob-cache@0.3.3...glob-cache@0.3.4) (2020-02-04)


### Bug Fixes

* docs runner, regen docs, and create-jest-runner updates ([d854e3d](https://github.com/tunnckoCore/opensource/commit/d854e3d335fa1d2c82d87321a07c6659fe6dcee1))
* dooh, readmes and bugs ([871666e](https://github.com/tunnckoCore/opensource/commit/871666e7eabbca6bf65cbc257311f0a46d410752))





## [0.3.3](https://github.com/tunnckoCore/opensource/compare/glob-cache@0.3.2...glob-cache@0.3.3) (2020-02-04)


### Bug Fixes

* coverage bugs, regen ([997f459](https://github.com/tunnckoCore/opensource/commit/997f459bff26b47f9119b4b7046f7b7d8b7afd6c))
* docks bug, re-run ([286e4af](https://github.com/tunnckoCore/opensource/commit/286e4af4de74899decf0bf71124b0abb214c887a))
* readme generation, API heading ([aa96c3f](https://github.com/tunnckoCore/opensource/commit/aa96c3f06af5a27b0e3b4119b92a9f7978e0e251))





## [0.3.2](https://github.com/tunnckoCore/opensource/compare/glob-cache@0.3.1...glob-cache@0.3.2) (2020-02-03)


### Bug Fixes

* mass update (docks,configs) + rename workspaces ([61ccee3](https://github.com/tunnckoCore/opensource/commit/61ccee33ca1cce122de9c7d6522a7a2913f65828))





## [0.3.1](https://github.com/tunnckoCore/opensource/compare/glob-cache@0.3.0...glob-cache@0.3.1) (2020-01-24)

**Note:** Version bump only for package glob-cache





# [0.3.0](https://github.com/tunnckoCore/opensource/compare/glob-cache@0.2.0...glob-cache@0.3.0) (2020-01-24)


### Bug Fixes

* format package.json files ([5f87d70](https://github.com/tunnckoCore/opensource/commit/5f87d70d369e2939c8ab85aff8863a4cfe7f44e5))
* upgrade deps ([a744c6d](https://github.com/tunnckoCore/opensource/commit/a744c6dbef340b51e246ecf874579a752b7aa35a))


### Features

* format, npm funding field, prettier-plugin-pkgjson ([5cd0a38](https://github.com/tunnckoCore/opensource/commit/5cd0a389a731e5634636f1a124decbaf36807824))





# [0.2.0](https://github.com/tunnckoCore/opensource/compare/glob-cache@0.1.4...glob-cache@0.2.0) (2020-01-21)


### Bug Fixes

* update broken docs generation ([e6c743f](https://github.com/tunnckoCore/opensource/commit/e6c743ff89745dcc9d70c3b9628048d1e3047381))


### Features

* **glob-cache:** support node 10; plus more docs ([25b1987](https://github.com/tunnckoCore/opensource/commit/25b1987f132b425c7506dd95bd2cb7df923bbaa7))





## [0.1.4](https://github.com/tunnckoCore/opensource/compare/glob-cache@0.1.3...glob-cache@0.1.4) (2020-01-19)


### Bug Fixes

* **glob-cache:** broken logo link ([14510f8](https://github.com/tunnckoCore/opensource/commit/14510f82f5a8a6e8abce5aa11165120d336b3790))





## [0.1.3](https://github.com/tunnckoCore/opensource/compare/glob-cache@0.1.2...glob-cache@0.1.3) (2020-01-19)


### Bug Fixes

* update badges & regenerate readmes ([9917d0a](https://github.com/tunnckoCore/opensource/commit/9917d0a8cb045e2b6f83935347d6bb35144686bc))





## [0.1.2](https://github.com/tunnckoCore/opensource/compare/glob-cache@0.1.1...glob-cache@0.1.2) (2020-01-19)


### Bug Fixes

* **glob-cache:** docs + 100% coverage :kiss: ([fde5f5f](https://github.com/tunnckoCore/opensource/commit/fde5f5fe6d707426f90041682eb1e7bbc75a682f))
* badges, regenerate readmes ([ccf3b73](https://github.com/tunnckoCore/opensource/commit/ccf3b73c123dc66f2b1964bb263ab9e331449d3c))
* **docks:** use html entities for < and >, regen readmes ([cd11b11](https://github.com/tunnckoCore/opensource/commit/cd11b1154edb8011495a979a96fbe6b5822bc05c))





## [0.1.1](https://github.com/tunnckoCore/opensource/compare/glob-cache@0.1.0...glob-cache@0.1.1) (2020-01-19)


### Bug Fixes

* update param type annotations, regen readmes ([783c4b9](https://github.com/tunnckoCore/opensource/commit/783c4b9ed402621ecdfbda524c0a53b30f83ae68))
* **docks:** supports param's type, run docs -> update readmes ([21da65c](https://github.com/tunnckoCore/opensource/commit/21da65ce3d0a73779a382262a8151da433f12ce3))
* **glob-cache:** add docs, generate readme ([9acd530](https://github.com/tunnckoCore/opensource/commit/9acd530b1723bf2f4ef436eb9079d02c9cabde9c))





# 0.1.0 (2020-01-18)

**Note:** Version bump only for package glob-cache
