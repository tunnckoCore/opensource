_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [gitcloneDefaults](./src/index.js#L58)

Creates consistent parsed object from string pattern or from listed arguments.
If `owner` is object, it can accepts `user` and `repo` properties. Treats that
`owner` argument as owner if `name` is string (which is the `repo`) from the
`user/repo` pattern.

<span id="gitclonedefaults-signature"></span>

#### Signature

```ts
function(owner, name, branch, ssh)
```

<span id="gitclonedefaults-params"></span>

#### Params

- `owner` **{string|object}** - the `user/repo` pattern or anything that
  [parse-github-url][] can parse
- `name` **{string|boolean|object}** - if boolean treats it as `ssh`
- `branch` **{string|boolean|object}** - if boolean treats it as `ssh`
- `ssh` **{boolean|object}** - useful in higher-level libs, and if it is
  `object` it can contains `ssh`
- `returns` **{object}** - result object contains anything that
  [parse-github-url][] contains and in addition has `ssh` and `dest` properties

<span id="gitclonedefaults-examples"></span>

#### Examples

```js
import gitcloneDefaults from 'gitclone-defaults';

gitcloneDefaults(
  {
    user: 'foo',
    repo: 'bar',
    branch: 'zeta',
  },
  true,
);
gitcloneDefaults({
  user: 'foo',
  repo: 'bar',
  branch: 'dev2',
});
gitcloneDefaults(
  {
    owner: 'foo',
    name: 'bar',
  },
  { dest: 'beta', ssh: true },
);
gitcloneDefaults(
  {
    owner: 'foo',
    name: 'bar',
  },
  { dest: 'beta' },
  true,
);
gitcloneDefaults('foo/bar');
gitcloneDefaults('foo', 'bar');
gitcloneDefaults('foo', 'bar', 'dev3');
gitcloneDefaults('foo', 'bar', 'dev3', { dest: 'dest3' });
gitcloneDefaults('foo/bar', { ssh: true });
gitcloneDefaults('foo/bar', { branch: 'opts' });
gitcloneDefaults('foo/bar', { branch: 'opts' }, { ssh: true });
gitcloneDefaults('foo/bar', { branch: 'opts' }, true);
gitcloneDefaults('foo', 'bar', 'baz', true);
gitcloneDefaults('foo/bar', { branch: 'qux' }, true);
gitcloneDefaults('foo/bar#dev', { ssh: true });
gitcloneDefaults('foo/bar#qux', true);
gitcloneDefaults('foo/bar#qux', true, { dest: 'ok' });
```
