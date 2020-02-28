_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [packageJson](./src/index.js#L36)

Get package metadata from the Unpkg instead of NPM registry. Optionally you can
pass `endpoint` function and return the build the registry url.

<span id="packagejson-signature"></span>

#### Signature

```ts
function(packageName, endpoint)
```

<span id="packagejson-params"></span>

#### Params

- `packageName` **{string}** - the package name, supports `pkg-name@1.2.2`
  (version) and `pkg-name@next` (dist-tag)
- `endpoint` **{function}** - like `(name, tag) => url`
- `returns` **{object}** - package metadata object

<span id="packagejson-examples"></span>

#### Examples

```js
import packageJson from '@tunnckocore/package-json';

async function main() {
  console.log(await packageJson('eslint'));
  console.log(await packageJson('package-json@4.0.0'));
  console.log(await packageJson('ava@next'));
  console.log(await packageJson('@babel/core'));
  console.log(await packageJson('@tunnckocore/package-json'));
}

main().catch(console.error);
```
