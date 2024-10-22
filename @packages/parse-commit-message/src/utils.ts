import type { Commit, Header, Options } from './types.ts';

export const errorMsg = `parse-commit-message: expect \`commit\` to follow:
<type>[optional scope]: <description>

[optional body]

[optional footer]`;

export function isValidString(x: string) {
  return Boolean(x && typeof x === 'string' && x.length > 0);
}

/**
 * When `options.headerRegex` is passed,
 * it should have 4 capturing groups: type, scope, bang, subject!
 *
 * @param {string} val
 * @param {object} options options to control the header regex and case sensitivity
 * @param {RegExp|string} options.headerRegex string regular expression or instance of RegExp
 * @param {boolean} options.caseSensitive whether or not to be case sensitive, defaults to `false`
 */
export function stringToHeader(val: string, options?: Options): Header {
  const opts = { caseSensitive: false, ...options };

  const defaultRegex = opts.caseSensitive
    ? /^(\w+)(?:\((.+)\))?(!)?: (.+)/
    : /^(\w+)(?:\((.+)\))?(!)?: (.+)/i;

  let regex: RegExp | null = null;

  if (opts.headerRegex && typeof opts.headerRegex === 'string') {
    regex = opts.caseSensitive ? new RegExp(opts.headerRegex) : new RegExp(opts.headerRegex, 'i');
  }

  if (opts.headerRegex && opts.headerRegex instanceof RegExp) {
    regex = opts.headerRegex;
  }

  if (!regex) {
    regex = defaultRegex;
  }

  if (!regex.test(val)) {
    throw new TypeError(errorMsg);
  }

  const matches = regex?.exec(val)?.slice(1);

  if (!matches) {
    throw new Error(errorMsg);
  }
  const [type, scope = null, bang = '', subject = ''] = matches;

  return {
    type: type + bang,
    scope,
    subject,
  };
}

export function normalizeCommit(commit: Commit, options?: Options) {
  const { header } = commit;
  if (
    header &&
    typeof header === 'object' &&
    'value' in header &&
    typeof header.value === 'string'
  ) {
    return { ...commit, header: stringToHeader(header.value, options) };
  }
  return commit;
}

export function toArray<T>(val: T): T[] {
  if (!val) return [];
  return [val];
}

export function isBreakingChange(commit: Commit) {
  const re = /^BREAKING\s+CHANGES?:\s+/;

  return (
    // give the bang precedence since it's the official way
    commit.header.type.endsWith('!') ||
    /break|breaking|major/i.test(commit.header.type) ||
    re.test(commit.header.subject) ||
    re.test(commit.body || '') ||
    re.test(commit.footer || '')
  );
}

export function cleaner(x) {
  return {
    ...x,
    header: {
      ...x.header,
      type: x.header.type.endsWith('!') ? x.header.type.slice(0, -1) : x.header.type,
    } as Header,
  };
}
