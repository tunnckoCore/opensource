export interface CommitResult {
  error?: Error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

export interface Mention {
  index: number;
  handle: string;
  mention: string;
}

export interface HeaderType {
  type: string;
  scope?: string | null;
  subject: string;
}

export interface SimpleHeader {
  value: string;
}

export type Header = HeaderType | SimpleHeader;

export interface Commit {
  header: Header;
  body?: string | null;
  footer?: string | null;
  increment?: string | boolean;
  isBreaking?: boolean;
  mentions?: Array<Mention>;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type PossibleCommit = string | Commit | Array<Commit>;

export type Plugin = (
  commit: Commit,
  normalize?: boolean,
) => void | {} | Commit;
export type Plugins = Plugin | Array<Plugin>;

export interface Mappers {
  mentions: Plugin;
  isBreaking: Plugin;
  isBreakingChange: Plugin;
}
