export const errorMsg = `parse-commit-message: expect \`commit\` to follow:
<type>[optional scope]: <description>

[optional body]

[optional footer]`;

export function isValidString(x) {
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
export function stringToHeader(val, options) {
  const opts = { caseSensitive: false, ...options };

  /* eslint-disable unicorn/no-unsafe-regex */
  const defaultRegex = opts.caseSensitive
    ? /^(\w+)(?:\((.+)\))?(!)?: (.+)/
    : /^(\w+)(?:\((.+)\))?(!)?: (.+)/i;

  let regex = null;

  if (opts.headerRegex && typeof opts.headerRegex === 'string') {
    regex = opts.caseSensitive
      ? new RegExp(opts.headerRegex)
      : new RegExp(opts.headerRegex, 'i');
  }

  if (opts.headerRegex && opts.headerRegex instanceof RegExp) {
    regex = opts.headerRegex;
  }

  regex = regex || defaultRegex;

  if (!regex.test(val)) {
    throw new TypeError(errorMsg);
  }

  const matches = regex.exec(val).slice(1);

  if (!matches) {
    throw new Error(errorMsg);
  }
  const [type, scope = null, bang = '', subject] = matches;

  return {
    type: type + bang,
    scope,
    subject,
  };
}

export function normalizeCommit(commit, options) {
  const { header } = commit;
  if (header && typeof header === 'object' && 'value' in header) {
    return { ...commit, header: stringToHeader(header.value, options) };
  }
  return commit;
}

export function toArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [val];
}

export function isBreakingChange(commit) {
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
      type: x.header.type.endsWith('!')
        ? x.header.type.slice(0, -1)
        : x.header.type,
    },
  };
}
