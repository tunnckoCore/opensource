_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [.exec](./src/index.js#L39)

Uses [execa][] v2, `execa.command()` method. As stated there, think of it as mix
of `child_process`'s `.execFile` and `.spawn`. It is pretty similar to the
`.shell` method too, but only visually because it does not uses the system's
shell, meaning it does not have access to the system's environment variables.
You also can control concurrency by passing `options.concurrency` option. For
example, pass `concurrency: 1` to run in series instead of in parallel which is
the default behavior.

<span id="exec-signature"></span>

#### Signature

```ts
function(cmds, options)
```

<span id="exec-params"></span>

#### Params

- `cmds` **{Array&lt;string&gt;}** - a string or array of string commands to
  execute in parallel or series
- `[options]` **{object}** - directly passed to [execa][] and so to
  `child_process`
- `returns` **{Promise}** - resolved or rejected promises

> It also can accept array of multiple strings of commands that will be executed
> in series or in parallel (default).

<span id="exec-examples"></span>

#### Examples

```js
import { exec } from '@tunnckocore/execa';
// or
// const { exec } = require('@tunnckocore/execa');

async function main() {
  await exec('echo "hello world"', { stdio: 'inherit' });

  // executes in series (because `concurrency` option is set to `1`)
  await exec(
    [
      'prettier-eslint --write foobar.js',
      'eslint --format codeframe foobar.js --fix',
    ],
    { stdio: 'inherit', preferLocal: true, concurrency: 1 },
  );
}

main();
```

### [.shell](./src/index.js#L95)

Similar to `exec`, but also **can** access the system's environment variables
from the command.

<span id="shell-signature"></span>

#### Signature

```ts
function(cmds, options)
```

<span id="shell-params"></span>

#### Params

- `cmds` **{Array&lt;string&gt;}** - a commands to execute in parallel or series
- `options` **{object}** - directly passed to `execa`
- `returns` **{Promise}** - resolved or rejected promises

<span id="shell-examples"></span>

#### Examples

```js
import { shell } from '@tunnckocore/execa';
// or
// const { shell } = require('@tunnckocore/execa');

async function main() {
  // executes in series
  await shell(['echo unicorns', 'echo "foo-$HOME-bar"', 'echo dragons'], {
    stdio: 'inherit',
  });

  // exits with code 3
  try {
    await shell(['exit 3', 'echo nah']);
  } catch (er) {
    console.error(er);
    // => {
    //  message: 'Command failed: /bin/sh -c exit 3'
    //  killed: false,
    //  code: 3,
    //  signal: null,
    //  cmd: '/bin/sh -c exit 3',
    //  stdout: '',
    //  stderr: '',
    //  timedOut: false
    // }
  }
}

main();
```

### [execa](./src/index.js#L121)

Same as [execa][]'s default export, see its documentation. Think of this as a
mix of `child_process.execFile()` and `child_process.spawn()`.

<span id="execa-signature"></span>

#### Signature

```ts
function(file, args, options)
```

<span id="execa-params"></span>

#### Params

- `file` **{string}** - executable to run
- `args` **{Array&lt;string&gt;}** - arguments / flags to be passed to `file`
- `options` **{object}** - optional options, passed to `child_process`'s methods

<span id="execa-examples"></span>

#### Examples

```js
import execa from '@tunnckocore/execa';
// or
// const execa = require('@tunnckocore/execa');

async function main() {
  await execa('npm', ['install', '--save-dev', 'react'], { stdio: 'inherit' });
}

main();
```
