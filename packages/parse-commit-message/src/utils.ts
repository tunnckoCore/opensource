import { Header, Commit } from './types.ts';
import mixinDEEEEEEEEEEEEEEP from './mixin-deep.ts';

export const mixinDeep = mixinDEEEEEEEEEEEEEEP;
export const errorMsg = `parse-commit-message: expect \`commit\` to follow:
<type>[optional scope]: <description>

[optional body]

[optional footer]`;

export function isValidString(x?: string) {
  return Boolean(x && typeof x === 'string' && x.length > 0);
}

export function stringToHeader(val: string, caseSensitive?: boolean): Header {
  const sensitive = caseSensitive || false;
  /* eslint-disable unicorn/no-unsafe-regex */
  const regex = sensitive
    ? /^(\w+)(?:\((.+)\))?(!)?: (.+)/
    : /^(\w+)(?:\((.+)\))?(!)?: (.+)/i;

  if (!regex.test(val)) {
    throw new TypeError(errorMsg);
  }

  // Wtf? There's no RegExp type?
  // @ts-ignore
  const matches = regex.exec(val).slice(1);

  if (!matches) {
    throw new Error(errorMsg);
  }
  const [type, scope = null, bang, subject] = matches;

  return {
    type: type + bang,
    scope,
    subject,
  };
}

export function normalizeCommit(commit: Commit) {
  const { header } = commit;
  if (header && typeof header === 'object' && 'value' in header) {
    return { ...commit, header: stringToHeader(header.value) };
  }
  return commit;
}

// ! Bypass TypeScript shits
// ! complete non-sense but because TypeScript
export function getValue(obj: any, key: string) {
  return obj && key in obj ? obj[key] : '';
}

export function toArray(val: any) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [val];
}

export function isBreakingChange(commit: Commit): boolean {
  const re = /^BREAKING\s+CHANGES?:\s+/;

  return (
    // give the bang precedence since it's the official way
    getValue(commit.header, 'type').endsWith('!') ||
    /break|breaking|major/i.test(getValue(commit.header, 'type')) ||
    re.test(getValue(commit.header, 'subject')) ||
    re.test(commit.body || '') ||
    re.test(commit.footer || '')
  );
}

export function cleaner(x: any = {}) {
  const type = getValue(x.header, 'type');

  return {
    ...x,
    header: {
      ...x.header,
      type: type.endsWith('!') ? type.slice(0, -1) : type,
    },
  };
}
