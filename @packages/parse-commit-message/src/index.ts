import mixinDeep from 'mixin-deep';

import increment from './plugins/increment.ts';
import isBreakingChange from './plugins/is-breaking-change.ts';
import mentions from './plugins/mentions.ts';
import type { Commit, Plugin, Plugins, PossibleCommit } from './types.ts';

// import { Commit, Plugin, Plugins, PossibleCommit } from '../types';
// 'chore(some): foo bar baz' -> { type: 'chore', scope: 'some', subject: 'foo bar baz' }
// for some freaking reason it does NOT report `toArray` as unused
// both typescript and eslint are playing some weird games today

export * from './utils.ts';

// export * from '../types';

/**
 * Apply a set of `plugins` over all of the given `commits`.
 * A plugin is a simple function passed with `Commit` object,
 * which may be returned to modify and set additional properties
 * to the `Commit` object.
 *
 * _The `commits` should be coming from `parse`, `validate` (with `ret` option)
 * or the `check` methods. It does not do checking and validation._
 *
 * @example
 * import dedent from 'dedent';
 * import { applyPlugins, plugins, parse, check } from 'parse-commit-message';
 *
 * const commits = [
 *   'fix: bar qux',
 *   dedent`feat(foo): yea yea
 *
 *   Awesome body here with @some mentions
 *   resolves #123
 *
 *   BREAKING CHANGE: ouch!`,
 *   'chore(ci): updates for ci config',
 *   {
 *     header: { type: 'fix', subject: 'Barry White' },
 *     body: 'okey dude',
 *     foo: 'possible',
 *   },
 * ];
 *
 * // Parses, normalizes, validates
 * // and applies plugins
 * const results = applyPlugins(plugins, check(parse(commits)));
 *
 * console.log(results);
 * // => [ { body: null,
 * //   footer: null,
 * //   header: { scope: null, type: 'fix', subject: 'bar qux' },
 * //   mentions: [],
 * //   increment: 'patch',
 * //   isBreaking: false },
 * // { body: 'Awesome body here with @some mentions\nresolves #123',
 * //   footer: 'BREAKING CHANGE: ouch!',
 * //   header: { scope: 'foo', type: 'feat', subject: 'yea yea' },
 * //   mentions: [ [Object] ],
 * //   increment: 'major',
 * //   isBreaking: true },
 * // { body: null,
 * //   footer: null,
 * //   header:
 * //    { scope: 'ci', type: 'chore', subject: 'updates for ci config' },
 * //   mentions: [],
 * //   increment: false,
 * //   isBreaking: false },
 * // { body: 'okey dude',
 * //   footer: null,
 * //   header: { scope: null, type: 'fix', subject: 'Barry White' },
 * //   foo: 'possible',
 * //   mentions: [],
 * //   increment: 'patch',
 * //   isBreaking: false } ]
 *
 * @name  .applyPlugins
 * @param {Plugins} plugins a simple function like `(commit) => {}`
 * @param {Array<string>|PossibleCommit} commits a PossibleCommit or an array of strings; a value which should already be gone through `parse`
 * @param {object} options options to control the header regex and case sensitivity
 * @param {RegExp|string} options.headerRegex string regular expression or instance of RegExp
 * @param {boolean} options.caseSensitive whether or not to be case sensitive, defaults to `false`
 * @returns {Array<Commit>} plus the modified or added properties from each function in `plugins`
 * @public
 */
export function applyPlugins(
  plugins: Plugins,
  commits: string[] | PossibleCommit,
  options?: any,
): Commit[] {
  const opts = { caseSensitive: false, normalize: true, ...options };
  // because some freaking weird things is happening
  // and it does report `toArray` as "cannot find name" by typescript
  // and as "no undef" by eslint.
  const arr: any = [];
  const cmts: any = [];
  const plgs = arr.concat(plugins).filter(Boolean);

  return cmts
    .concat(commits)
    .filter(Boolean)
    .reduce((result, commit) => {
      let commitObject = {};

      if (typeof commit === 'string') {
        commitObject = { header: { value: commit } };
      } else if (typeof commit === 'object' && !Array.isArray(commit)) {
        commitObject = commit;
      }
      const cmt = plgs.reduce((acc, fn) => {
        const res = fn(acc, opts);
        return mixinDeep(acc, res);
      }, commitObject);

      return result.concat(cmt);
    }, []);
}

/**
 * An array which includes `mentions`, `isBreakingChange` and `increment` built-in plugins.
 * The `mentions` is an array of objects - basically what's returned from
 * the [collect-mentions][] package.
 *
 * @example
 * import { plugins, applyPlugins, parse } from 'parse-commit-message';
 *
 * console.log(plugins); // =>  [mentions, increment]
 * console.log(plugins[0]); // => [Function mentions]
 * console.log(plugins[1]); // => [Function increment]
 *
 * const cmts = parse([
 *   'fix: foo @bar @qux haha',
 *   'feat(cli): awesome @tunnckoCore feature\n\nSuper duper baz!',
 *   'fix: ooh\n\nBREAKING CHANGE: some awful api change'
 * ]);
 *
 * const commits = applyPlugins(plugins, cmts);
 * console.log(commits);
 * // => [
 * //   {
 * //     header: { type: 'fix', scope: '', subject: 'foo bar baz' },
 * //     body: '',
 * //     footer: '',
 * //     increment: 'patch',
 * //     isBreaking: false,
 * //     mentions: [
 * //       { handle: '@bar', mention: 'bar', index: 8 },
 * //       { handle: '@qux', mention: 'qux', index: 13 },
 * //     ]
 * //   },
 * //   {
 * //     header: { type: 'feat', scope: 'cli', subject: 'awesome feature' },
 * //     body: 'Super duper baz!',
 * //     footer: '',
 * //     increment: 'minor',
 * //     isBreaking: false,
 * //     mentions: [
 * //       { handle: '@tunnckoCore', mention: 'tunnckoCore', index: 18 },
 * //     ]
 * //   },
 * //   {
 * //     header: { type: 'fix', scope: '', subject: 'ooh' },
 * //     body: 'BREAKING CHANGE: some awful api change',
 * //     footer: '',
 * //     increment: 'major',
 * //     isBreaking: true,
 * //     mentions: [],
 * //   },
 * // ]
 *
 * @name .plugins
 * @public
 */
export const plugins: Plugin[] = [mentions, increment, isBreakingChange] as Plugin[];

/**
 * An object (named set) which includes `mentions` and `increment` built-in plugins.
 *
 * @example
 * import { mappers, applyPlugins, parse } from 'parse-commit-message';
 *
 * console.log(mappers); // => { mentions, increment }
 * console.log(mappers.mentions); // => [Function mentions]
 * console.log(mappers.increment); // => [Function increment]
 *
 * const flat = true;
 * const parsed = parse('fix: bar', flat);
 * console.log(parsed);
 * // => {
 * //   header: { type: 'feat', scope: 'cli', subject: 'awesome feature' },
 * //   body: 'Super duper baz!',
 * //   footer: '',
 * // }
 *
 * const commit = applyPlugins([mappers.increment], parsed);
 * console.log(commit)
 * // => [{
 * //   header: { type: 'feat', scope: 'cli', subject: 'awesome feature' },
 * //   body: 'Super duper baz!',
 * //   footer: '',
 * //   increment: 'patch',
 * // }]
 *
 * @name .mappers
 * @public
 */
export const mappers: Record<string, Plugin> = {
  mentions,
  increment,
  isBreaking: isBreakingChange,
  isBreakingChange,
} as Record<string, Plugin>;

export { parse, validate } from './main.ts';
export { stringify, check } from './main.ts';
export { parseHeader, stringifyHeader, checkHeader, validateHeader } from './header.ts';
export { parseCommit, stringifyCommit, checkCommit, validateCommit } from './commit.ts';
