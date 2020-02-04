

_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [stringifyGithubShortUrl](./src/index.js#L30)

Generate github / npm shorthand from list
of arguments or object.

<span id="stringifygithubshorturl-signature"></span>

#### Signature

```ts
function(owner, name, branch, npm)
```

<span id="stringifygithubshorturl-params"></span>

#### Params

- `<owner>` **{string|object}** - user or org string, or object
- `[name]` **{string}** - repo name
- `[branch]` **{string}** - branch name
- `[npm]` **{string}** - pass `true` if you want to generate npm shorthand
- `returns` **{string}** - generated shorthand



<span id="stringifygithubshorturl-examples"></span>

#### Examples

```js
import stringify from 'stringify-github-short-url';

stringify('jonschlinkert', 'micromatch');          // => 'jonschlinkert/micromatch'
stringify('jonschlinkert', 'micromatch', 'dev');   // => 'jonschlinkert/micromatch#dev'
stringify('gulpjs', 'gulp', 'v3.8.1', true);       // => 'gulpjs/gulp@v3.8.1'
stringify({
  owner: 'tunnckoCore',
  name: 'parse-function'
}); // => 'tunnckoCore/parse-function'
stringify({
  user: 'assemble',
  repo: 'assemble-core'
}); // => 'assemble/assemble-core'
```

