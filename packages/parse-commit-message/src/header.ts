import { isValidString, stringToHeader } from './utils.ts';

import { Header, CommitResult } from './types.ts';

/**
 * Parses given `header` string into an header object.
 * Basically the same as [.parse](#parse), except that
 * it only can accept single string and returns a `Header` object.
 *
 * _The `parse*` methods are not doing any checking and validation,
 * so you may want to pass the result to `validateHeader` or `checkHeader`,
 * or to `validateHeader` with `ret` option set to `true`._
 *
 * @example
 * import { parseHeader } from 'parse-commit-message';
 *
 * const longCommitMsg = `fix: bar qux
 *
 * Awesome body!`;
 *
 * const headerObj = parseCommit(longCommitMsg);
 * console.log(headerObj);
 * // => { type: 'fix', scope: null, subject: 'bar qux' }
 *
 * @name  .parseHeader
 * @param {string} header a header stirng like `'fix(foo): bar baz'`
 * @returns {Header} a `Header` object like `{ type, scope?, subject }`
 * @public
 */
export function parseHeader(header: string): Header {
  if (!isValidString(header)) {
    throw new TypeError('expect `header` to be non empty string');
  }

  return stringToHeader(header.trim());
}

/**
 * Receives a `header` object, validates it using `validateHeader`,
 * builds a "header" string and returns it. Method throws if problems found.
 * Basically the same as [.stringify](#stringify), except that
 * it only can accept single `Header` object.
 *
 * @example
 * import { stringifyHeader } from 'parse-commit-message';
 *
 * const headerStr = stringifyCommit({ type: 'foo', subject: 'bar qux' });
 * console.log(headerStr); // => 'foo: bar qux'
 *
 * @name  .stringifyHeader
 * @param {Header} header a `Header` object like `{ type, scope?, subject }`
 * @returns {string} a header stirng like `'fix(foo): bar baz'`
 * @public
 */
export function stringifyHeader(header: Header): string {
  const res: CommitResult = validateHeader(header);

  if (res.error) {
    throw res.error;
  }

  // if SimpleHeader (res.value is like { value: 'chore: foobar' })
  // TODO(@tunnckoCore): not sure...
  /* istanbul ignore next */
  if (res.value && typeof res.value === 'object' && 'value' in res.value) {
    return res.value.value;
  }

  const { type, scope, subject } = res.value;

  return `${type}${scope ? `(${scope})` : ''}: ${subject}`.trim();
}

/**
 * Validates given `header` object and returns `boolean`.
 * You may want to pass `ret` to return an object instead of throwing.
 * Basically the same as [.validate](#validate), except that
 * it only can accept single `Header` object.
 *
 * @example
 * import { validateHeader } from 'parse-commit-message';
 *
 * const header = { type: 'foo', subject: 'bar qux' };
 *
 * const headerIsValid = validateHeader(header);
 * console.log(headerIsValid); // => true
 *
 * const { value } = validateHeader(header, true);
 * console.log(value);
 * // => {
 * //   header: { type: 'foo', scope: null, subject: 'bar qux' },
 * //   body: 'okey dude',
 * //   footer: null,
 * // }
 *
 * const { error } = validateHeader({
 *   type: 'bar'
 * }, true);
 *
 * console.log(error);
 * // => TypeError: header.subject should be non empty string
 *
 * @name  .validateHeader
 * @param {Header} header a `Header` object like `{ type, scope?, subject }`
 * @returns {CommitResult} an object like `{ value: Array<Commit>, error: Error }`
 * @public
 */
export function validateHeader(header: Header): CommitResult {
  const result: CommitResult = {};

  try {
    result.value = checkHeader(header);
  } catch (err) {
    return { error: err };
  }

  return result;
}

/**
 * Receives a `Header` and checks if it is valid.
 * Basically the same as [.check](#check), except that
 * it only can accept single `Header` object.
 *
 * @example
 * import { checkHeader } from 'parse-commit-message';
 *
 * try {
 *   checkHeader({ type: 'fix' });
 * } catch(err) {
 *   console.log(err);
 *   // => TypeError: header.subject should be non empty string
 * }
 *
 * // throws because can accept only Header objects
 * checkHeader('foo bar baz');
 * checkHeader(123);
 * checkHeader([]);
 * checkHeader([{ type: 'foo', subject: 'bar' }]);
 *
 * @name  .checkHeader
 * @param {Header} header a `Header` object like `{ type, scope?, subject }`
 * @returns {Header} returns the same as given if no problems, otherwise it will throw.
 * @public
 */
export function checkHeader(header: Header, caseSensitive?: boolean): Header {
  const sensitive = caseSensitive || false;

  // handy trick to suppress/mute typescript
  if (header && typeof header === 'object' && 'value' in header) {
    const { value } = header;
    return stringToHeader(value, sensitive);
  }
  // else: we have Header

  // @ts-ignore
  if (!isValidString(header.type)) {
    throw new TypeError('header.type should be non empty string');
  }
  // @ts-ignore
  if (!isValidString(header.subject)) {
    throw new TypeError('header.subject should be non empty string');
  }

  const isValidScope =
    'scope' in header && header.scope !== null
      ? isValidString(header.scope)
      : true;

  if (!isValidScope) {
    throw new TypeError(
      'commit.header.scope should be non empty string when given',
    );
  }

  return { scope: null, ...header };
}
