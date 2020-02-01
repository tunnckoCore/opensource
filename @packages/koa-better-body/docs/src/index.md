_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [koaBetterBody](./src/index.js#L36)

> Robust body parser for [koa][]@1, also works for `koa@2` (with deprecations).
> Will also work for future `koa@3` with [koa-convert][].

<span id="koabetterbody-signature"></span>

#### Signature

```ts
function(options)
```

<span id="koabetterbody-params"></span>

#### Params

- `options` **{object}** - see more on [options section](#options)
- `returns` **{GeneratorFunction}** - plugin for Koa

<span id="koabetterbody-examples"></span>

#### Examples

```js
var koa = require('koa');
var body = require('koa-better-body');
var app = koa();

app
  .use(body())
  .use(function*() {
    console.log(this.request.body); // if buffer or text
    console.log(this.request.files); // if multipart or urlencoded
    console.log(this.request.fields); // if json
  })
  .listen(8080, function() {
    console.log('koa server start listening on port 8080');
  });
```
