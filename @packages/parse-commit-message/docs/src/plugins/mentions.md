_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [mentionsPlugin](./src/plugins/mentions.js#L27)

A plugin that adds `mentions` array property to the `commit`. It is already
included in the `plugins` named export, and in `mappers` named export. Basically
each entry in that array is an object, directly returned from the
[collect-mentions][].

<span id="mentionsplugin-signature"></span>

#### Signature

```ts
function(commit, options)
```

<span id="mentionsplugin-params"></span>

#### Params

- `commit` **{Commit}** - a standard `Commit` object
- `options` **{object}** - options to control the header regex and case
  sensitivity
- `options.headerRegex` **{RegExp|string}** - string regular expression or
  instance of RegExp
- `options.caseSensitive` **{boolean}** - whether or not to be case sensitive,
  defaults to `false`
- `returns` **{Commit}** - plus `{ mentions: Array<Mention> }`

_See the [.plugins](#plugins) and [.mappers](#mappers) examples._

<span id="mentionsplugin-examples"></span>

#### Examples

```js
import { mappers, plugins } from 'parse-commit-message';

console.log(mappers.mentions); // => [Function: mentionsPlugin]
console.log(plugins[0]); // => [Function: mentionsPlugin]
```
