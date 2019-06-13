import execa from 'execa';
import pMap from 'p-map-series';
import { splitToObject } from 'split-cmd';
/**
 * Same as [execa][]'s main export
 * [here](https://github.com/sindresorhus/execa#execafile-arguments-options)
 * As state there, think of it as mix of `child_process`'s `.execFile` and `.spawn`.
 * It is pretty similar to the `.shell` method too, but only visually because
 * it does not uses the system's shell.
 *
 * > It also can accept array of multiple strings of commands that will be
 * executed in series.
 *
 * @example
 * import { exec } from '@tunnckocore/execa';
 * // or
 * // const { exec } = require('@tunnckocore/execa');
 *
 * async function init () {
 *   await exec('echo "hello world"', { stdio: 'inherit' });
 *
 *   // executes in series
 *   await exec([
 *     'prettier-eslint --write foobar.js',
 *     'eslint --format codeframe foobar.js --fix'
 *   ], { stdio: 'inherit', preferLocal: true });
 * }
 *
 * init();
 *
 * @name   .exec
 * @param  {string|Array<string>} cmds a commands to execute, if array of strings executes them serially
 * @param  {object} opts directly passed to [execa][] and so to `child_process`
 * @return {Promise} resolved or rejected promises
 * @public
 */

export function exec(cmds, opts) {
  return factory('exec')(cmds, opts);
}
/**
 * Same as [execa][]'s `.shell` method, but also can accept an array of multiple
 * commands that will be executed in the system's shell,
 * [see its docs](https://github.com/sindresorhus/execa#execashellcommand-options)
 * for more info.
 *
 * @example
 * import { shell } from '@tunnckocore/execa';
 * // or
 * // const { shell } = require('@tunnckocore/execa');
 *
 * async function init () {
 *   // executes in series
 *   await shell([
 *     'echo unicorns',
 *     'echo dragons'
 *   ], { stdio: 'inherit' });
 *
 *   // exits with code 3
 *   try {
 *     await shell([
 *       'exit 3',
 *       'echo nah'
 *     ]);
 *   } catch (er) {
 *     console.error(er);
 *     // => {
 *     //  message: 'Command failed: /bin/sh -c exit 3'
 *     //  killed: false,
 *     //  code: 3,
 *     //  signal: null,
 *     //  cmd: '/bin/sh -c exit 3',
 *     //  stdout: '',
 *     //  stderr: '',
 *     //  timedOut: false
 *     // }
 *   }
 * }
 *
 * init();
 *
 * @name   .shell
 * @param  {string|Array<string>} cmds a commands to execute, if array of strings executes them serially
 * @param  {object} opts directly passed to `execa.shell` method.
 * @return {Promise} resolved or rejected promises
 * @public
 */

export function shell(cmds, opts) {
  return factory('shell')(cmds, opts);
}

function factory(type) {
  const cmd = {
    exec: execa,
    shell: execa.shell
  };
  return (cmds, opts) => {
    const commands = [].concat(cmds);
    const options = Object.assign({
      cwd: process.cwd()
    }, opts);

    const mapper = cmdLine => {
      const run = cmd[type];

      if (type === 'shell') {
        return run(cmdLine, options);
      }

      const parts = splitToObject(cmdLine);
      return run(parts.command, [].concat(parts.args), options);
    };

    return pMap(commands, mapper);
  };
}