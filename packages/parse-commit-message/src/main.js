import { parseCommit, stringifyCommit, checkCommit } from './commit.js';
import { toArray, errorMsg } from './utils.js';

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
 * @param {PossibleCommit} commits a value to be parsed into an object like `Commit` type
 * @param {object} options options to control the header regex and case sensitivity
 * @param {RegExp|string} options.headerRegex string regular expression or instance of RegExp
 * @param {boolean} options.caseSensitive whether or not to be case sensitive, defaults to `false`
 * @returns {Array<Commit>} if array of commit objects
 * @public
 */
export function parse(commits, options) {
  const result = toArray(commits)
    .filter(Boolean)
    .reduce((acc, val) => {
      if (typeof val === 'string') {
        return acc.concat(parseCommit(val, options));
      }
      if (typeof val === 'object' && !Array.isArray(val)) {
        return acc.concat(val);
      }

      return acc.concat(parse(val, options));
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
 * @param {PossibleCommit} commits a `Commit` object, or anything that can be passed to `check`
 * @param {object} options options to control the header regex and case sensitivity
 * @param {RegExp|string} options.headerRegex string regular expression or instance of RegExp
 * @param {boolean} options.caseSensitive whether or not to be case sensitive, defaults to `false`
 * @returns {Array<string>} an array of commit strings like `'fix(foo): bar baz'`
 * @public
 */
export function stringify(commits, options) {
  const result = toArray(commits)
    .filter(Boolean)
    .reduce(
      (acc, val) =>
        acc.concat(
          toArray(
            check(
              typeof val === 'string' ? { header: { value: val } } : val,
              options,
            ),
          ).map((x) => stringifyCommit(x, options)),
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
 * @param {PossibleCommit} commits a value to be parsed & validated into an object like `Commit` type
 * @param {object} options options to control the header regex and case sensitivity
 * @param {RegExp|string} options.headerRegex string regular expression or instance of RegExp
 * @param {boolean} options.caseSensitive whether or not to be case sensitive, defaults to `false`
 * @returns {CommitResult} an object like `{ value: Array<Commit>, error: Error }`
 * @public
 */
export function validate(commits, options) {
  const result = {};

  try {
    result.value = check(commits, options);
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
 * @param {PossibleCommit} commits a value to be parsed & validated into an object like `Commit` type
 * @param {object} options options to control the header regex and case sensitivity
 * @param {RegExp|string} options.headerRegex string regular expression or instance of RegExp
 * @param {boolean} options.caseSensitive whether or not to be case sensitive, defaults to `false`
 * @returns {Array<Commit>} returns the same as given if no problems, otherwise it will throw;
 * @public
 */
export function check(commits, options) {
  const result = toArray(commits).reduce((acc, commit) => {
    if (typeof commit === 'string') {
      // eslint-disable-next-line no-param-reassign
      commit = parseCommit(commit, options);
    }

    return acc.concat(checkCommit(commit, options));
  }, []);

  if (result.length === 0) {
    throw new Error(errorMsg);
  }

  return result;
}
