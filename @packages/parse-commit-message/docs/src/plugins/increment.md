_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [incrementPlugin](./src/plugins/increment.js#L26)

A plugin that adds `increment` property to the `commit`. It is already included
in the `plugins` named export, and in `mappers` named export.

**Note: Since v4 this plugin doesn't add `isBreaking` property, use the
`isBreaking` plugin instead.**

<span id="incrementplugin-signature"></span>

#### Signature

```ts
function(commit, options)
```

<span id="incrementplugin-params"></span>

#### Params

- `commit` **{Commit}** - a standard `Commit` object
- `options` **{object}** - options to control the header regex and case
  sensitivity
- `options.headerRegex` **{RegExp|string}** - string regular expression or
  instance of RegExp
- `options.caseSensitive` **{boolean}** - whether or not to be case sensitive,
  defaults to `false`
- `returns` **{Commit}** - plus `{ increment: string }`

_See the [.plugins](#plugins) and [.mappers](#mappers) examples._

<span id="incrementplugin-examples"></span>

#### Examples

```js
import { mappers, plugins } from 'parse-commit-message';

console.log(mappers.increment); // => [Function: incrementPlugin]
console.log(plugins[1]); // => [Function: incrementPlugin]
```
