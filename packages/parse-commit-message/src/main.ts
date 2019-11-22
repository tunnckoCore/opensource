import { parseCommit, stringifyCommit, checkCommit } from './commit.ts';
import { Commit, CommitResult, PossibleCommit } from './types.ts';
import { toArray } from './utils.ts';

/**
 * Receives and parses a single or multiple commit message(s) in form of string,
 * object, array of strings, array of objects or mixed.
 *
 * @example
 * import { parse } from 'parse-commit-message';
 *
 * const commits = [
 *   'fix(ci): tweaks for @circleci config',
 *   'chore: bar qux'
 * ];
 * const result = parse(commits);
 * console.log(result);
 * // => [{
 * //   header: { type: 'fix', scope: 'ci', subject: 'tweaks for @circleci config' },
 * //   body: null,
 * //   footer: null,
 * // }, {
 * //   header: { type: 'chore', scope: null, subject: 'bar qux' },
 * //   body: null,
 * //   footer: null,
 * // }]
 *
 * const commitMessage = `feat: awesome yeah
 *
 * Awesome body!
 * resolves #123
 *
 * Signed-off-by: And Footer <abc@exam.pl>`;
 *
 * const res = parse(commitMessage);
 *
 * console.log(res);
 * // => {
 * //   header: { type: 'feat', scope: null, subject: 'awesome yeah' },
 * //   body: 'Awesome body!\nresolves #123',
 * //   footer: 'Signed-off-by: And Footer <abc@exam.pl>',
 * // }
 *
 * @name  .parse
 * @param {string|Commit|array} commits a value to be parsed into an object like `Commit` type
 * @returns {Array<Commit>} if array of commit objects
 * @public
 */
export function parse(commits: PossibleCommit): Array<Commit> {
  const result: Array<Commit> = toArray(commits)
    .filter(Boolean)
    .reduce((acc: Array<Commit>, val: string | Commit) => {
      if (typeof val === 'string') {
        return acc.concat(parseCommit(val));
      }
      if (typeof val === 'object' && !Array.isArray(val)) {
        return acc.concat(val);
      }

      return acc.concat(parse(val));
    }, []);

  return result;
}

/**
 * Receives a `Commit` object, validates it using `validate`,
 * builds a "commit" message string and returns it.
 *
 * This method does checking and validation too,
 * so if you pass a string, it will be parsed and validated,
 * and after that turned again to string.
 *
 * @example
 * import { parse, stringify } from 'parse-commit-message';
 *
 * const commitMessage = `feat: awesome yeah
 *
 * Awesome body!
 * resolves #123
 *
 * Signed-off-by: And Footer <abc@exam.pl>`;
 *
 * const flat = true;
 * const res = parse(commitMessage, flat);
 *
 * const str = stringify(res, flat);
 * console.log(str);
 * console.log(str === commitMessage);
 *
 * @name  .stringify
 * @param {string|Commit|Array<Commit>} commits a `Commit` object, or anything that can be passed to `check`
 * @returns {Array<string>} an array of commit strings like `'fix(foo): bar baz'`
 * @public
 */
export function stringify(commits: PossibleCommit): Array<string> {
  const result: Array<string> = toArray(commits)
    .filter(Boolean)
    .reduce(
      (acc: Array<string>, val: PossibleCommit) =>
        acc.concat(
          toArray(
            check(typeof val === 'string' ? { header: { value: val } } : val),
          ).map((x: any) => stringifyCommit(x)),
        ),
      [],
    );

  return result;
}

/**
 * Validates a single or multiple commit message(s) in form of string,
 * object, array of strings, array of objects or mixed.
 *
 * @example
 * import { validate } from 'parse-commit-message';
 *
 * console.log(validate('foo bar qux')); // false
 * console.log(validate('foo: bar qux')); // true
 * console.log(validate('fix(ci): bar qux')); // true
 *
 * console.log(validate(['a bc cqux', 'foo bar qux'])); // false
 *
 * console.log(validate({ qux: 1 })); // false
 * console.log(validate({ header: { type: 'fix' } })); // false
 * console.log(validate({ header: { type: 'fix', subject: 'ok' } })); // true
 *
 * const commitObject = {
 *   header: { type: 'test', subject: 'updating tests' },
 *   foo: 'bar',
 *   isBreaking: false,
 *   body: 'oh ah',
 * };
 * console.log(validate(commitObject)); // true
 *
 * const result = validate('foo bar qux');
 * console.log(result.error);
 * // => Error: expect \`commit\` to follow:
 * // <type>[optional scope]: <description>
 * //
 * // [optional body]
 * //
 * // [optional footer]
 *
 * const res = validate('fix(ci): okey barry');
 * console.log(result.value);
 * // => [{
 * //   header: { type: 'fix', scope: 'ci', subject: 'okey barry' },
 * //   body: null,
 * //   footer: null,
 * // }]
 *
 * const commit = { header: { type: 'fix' } };
 * const { error } = validate(commit);
 * console.log(error);
 * // => TypeError: header.subject should be non empty string
 *
 *
 * const commit = { header: { type: 'fix', scope: 123, subject: 'okk' } };
 * const { error } = validate(commit);
 * console.log(error);
 * // => TypeError: header.scope should be non empty string when given
 *
 * @name  .validate
 * @param {string|Commit|Array<Commit>} commits a value to be parsed & validated into an object like `Commit` type
 * @returns {CommitResult} an object like `{ value: Array<Commit>, error: Error }`
 * @public
 */
export function validate(commits: PossibleCommit): CommitResult {
  const result: CommitResult = {};

  try {
    result.value = check(commits);
  } catch (err) {
    return { error: err };
  }

  return result;
}

/**
 * Receives a single or multiple commit message(s) in form of string,
 * object, array of strings, array of objects or mixed.
 * Throws if find some error. Think of it as "assert", it's basically that.
 *
 * @example
 * import { check } from 'parse-commit-message';
 *
 * try {
 *   check({ header: { type: 'fix' } });
 * } catch(err) {
 *   console.log(err);
 *   // => TypeError: header.subject should be non empty string
 * }
 *
 * // Can also validate/check a strings, array of strings,
 * // or even mixed - array of strings and objects
 * try {
 *   check('fix(): invalid scope, it cannot be empty')
 * } catch(err) {
 *   console.log(err);
 *   // => TypeError: header.scope should be non empty string when given
 * }
 *
 * @name  .check
 * @param {string|Commit|Array<Commit>} commits a value to be parsed & validated into an object like `Commit` type
 * @returns {Array<Commit>} returns the same as given if no problems, otherwise it will throw;
 * @public
 */
export function check(commits: PossibleCommit): Array<Commit> {
  const result: Array<Commit> = toArray(commits)
    .filter((x: PossibleCommit) => x !== null || x !== undefined)
    .reduce((acc: Array<Commit>, commit: string | Commit) => {
      if (typeof commit === 'string') {
        commit = parseCommit(commit); // eslint-disable-line no-param-reassign
      }
      return acc.concat(checkCommit(commit));
    }, []);

  return result;
}
