_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [ipFilter](./src/index.js#L44)

Filter `ip` against glob `patterns`, using [micromatch][] under the hood, so
`options` are passed to it.

<span id="ipfilter-signature"></span>

#### Signature

```ts
function(ip, patterns, options)
```

<span id="ipfilter-params"></span>

#### Params

- `ip` **{string}** - Accepts only valid IPs by default
- `patterns` **{string|array}** - Basically everything that [micromatch][]'s
  second argument can accept.
- `options` **{object}** - Pass `strict: false` if want to validate non-ip
  values, options are also passed to [micromatch][].
- `returns` **{string}** - a `string` or `null` If not match returns `null`,
  otherwise the passed `ip` as string.

<span id="ipfilter-examples"></span>

#### Examples

```js
const ipFilter = require('ip-filter');

console.log(ipFilter('123.77.34.89', '123.??.34.8*')); // => '123.77.34.89'
console.log(ipFilter('123.222.34.88', '123.??.34.8*')); // => null
console.log(ipFilter('123.222.33.1', ['123.*.34.*', '*.222.33.*'])); // => '123.222.33.1'

// should notice the difference
console.log(ipFilter('123.222.34.88', ['123.*.34.*', '!123.222.**']));
// => null
console.log(ipFilter('123.222.34.88', ['123.*.34.*', '!123.222.*']));
// => '123.222.34.88'
```

<span id="ipfilter-examples"></span>

#### Examples

```js
const ipFilter = require('ip-filter');
//
// NON-STRICT mode
//

const res = ipFilter('x-koaip', ['*-koaip', '!foo-koa*'], { strict: false });
console.log(res); // => 'x-koaip'

const res = ipFilter('x-koa.foo', ['*-koa.*', '!foo-koa.*'], { strict: false });
console.log(res); // => 'x-koa.foo'
```
