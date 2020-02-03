_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [babelPresetOptimize](./src/index.js#L14)

Be aware that when you use `minifyBuiltins: true` you _MAY_ get a bigger output,
but that's not always guaranteed, just try for your case.

<span id="babelpresetoptimize-signature"></span>

#### Signature

```ts
function(api, options)
```

<span id="babelpresetoptimize-params"></span>

#### Params

- `options` **{object}** - optionally control what can be included
- `options.react` **{boolean}** - default `false`, includes the React preset and
  3 react plugins
- `options.typescript` **{boolean}** - default `false`, includes the TypeScript
  preset
- `options.minifyBuiltins` **{boolean}** - default `false`, includes
  [babel-plugin-minify-builtins][]
