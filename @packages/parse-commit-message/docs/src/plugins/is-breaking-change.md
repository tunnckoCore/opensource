_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [isBreakingChangePlugin](./src/plugins/is-breaking-change.js#L30)

A plugin that adds `isBreakingChange` and `isBreaking` (_deprecated_) properties
to the `commit`. It is already included in the `plugins` named export, and in
`mappers` named export. Be aware that there's a difference between the utility
`isBreakingChange` which has named export (as everything from `src/utils`) and
this plugin function.

**Note: This plugin was included in v4 release version, previously was part of
the `increment` plugin.**

<span id="isbreakingchangeplugin-signature"></span>

#### Signature

```ts
function(commit, options)
```

<span id="isbreakingchangeplugin-params"></span>

#### Params

- `commit` **{Commit}** - a standard `Commit` object
- `options` **{object}** - options to control the header regex and case
  sensitivity
- `options.headerRegex` **{RegExp|string}** - string regular expression or
  instance of RegExp
- `options.caseSensitive` **{boolean}** - whether or not to be case sensitive,
  defaults to `false`
- `returns` **{Commit}** - plus `{ isBreakingChange: boolean }`

_See the [.plugins](#plugins) and [.mappers](#mappers) examples._

<span id="isbreakingchangeplugin-examples"></span>

#### Examples

```js
import { mappers, plugins } from 'parse-commit-message';

console.log(mappers.isBreakingChange); // => [Function: isBreakingChangePlugin]
console.log(plugins[2]); // => [Function: isBreakingChangePlugin]
```
