

_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [babelPresetOptimize](./src/index.js#L22)

Be aware that when you use `minifyBuiltins: true` you _MAY_ get a bigger output,
but that's not always guaranteed, just try for your case.

If you want to use JSX (React) pass `options.jsx: true`.
If you want to use JSX (React) + TypeScript pass both `{ jsx: true, typescript: true }`.
If you wan to use Preact + TypeScript, `{ jsx: { pragma: 'h' }, typescript: true }`,
if `options.jsx` is an object, it is directly passed to `preset-react`.

<span id="babelpresetoptimize-signature"></span>

#### Signature

```ts
function(api, options)
```

<span id="babelpresetoptimize-params"></span>

#### Params

- `options` **{object}** - optionally control what can be included
- `options.jsx` **{boolean}** - default `false`, pass `true` if you want `react`; pass an object for more customization (passed to react preset)
- `options.commonjs` **{boolean}** - default `false`, pass non-falsey value to transform ESModules to CommonJS
- `options.typescript` **{boolean}** - default `false`, includes the TypeScript preset
- `options.development` **{boolean}** - default `false`, disables few plugins; when it is `true` and `options.jsx` is enabled (true or object) we add `options.jsx.development: true` too
- `options.minifyBuiltins` **{boolean}** - default `false`, includes [babel-plugin-minify-builtins][]

