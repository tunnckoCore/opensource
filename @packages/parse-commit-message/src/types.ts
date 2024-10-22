export type Result<T> = {
  error?: Error;
  value?: T;
};

export type Mention = {
  index: number;
  handle: string;
  mention: string;
};

export type Header = {
  type: string;
  scope?: string | null;
  subject: string;
};

export type SimpleHeader = {
  value: string;
};

export type GenericCommit<T> = {
  header: T;
  body?: string | null;
  footer?: string | null;
  increment?: string;
  isBreaking?: boolean;
  mentions?: Array<Mention>;
};

export type Commit = GenericCommit<Header>;
export type BasicCommit = GenericCommit<SimpleHeader>;

export type PossibleCommit = string | Commit | BasicCommit | Commit[] | BasicCommit[];

export type Plugin = (
  commit: PossibleCommit,
  normalize?: boolean,
) => void | Record<string, any> | Commit | BasicCommit;
export type Plugins = Plugin | Array<Plugin>;

export type Mappers = {
  mentions: Plugin;
  isBreaking: Plugin;
  isBreakingChange: Plugin;
};

export type Options = {
  caseSensitive?: boolean;
  headerRegex?: RegExp | string;
  mentionsWithDot?: boolean;
  normalize?: boolean;
};
