import { ParserOptions } from '@babel/parser';
import { File } from '@babel/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FnType = (...args: any) => any;

export type Input = FnType | string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Plugin = (node: any, result: Result) => Result | undefined;
export type Plugins = Plugin | Array<Plugin>;

export interface Options {
  parse?(input: string, options?: ParserOptions): File;
  parseExpression?(input: string, options?: ParserOptions): File;
  parserOptions?: ParserOptions;
  plugins?: Plugins;
}

export interface Result {
  name: string | null;
  body: string;
  args: Array<string>;
  params: string;
  defaults: { [key: string]: string | undefined };
  value: string;
  isValid: boolean;
  isArrow: boolean;
  isAsync: boolean;
  isNamed: boolean;
  isAnonymous: boolean;
  isGenerator: boolean;
  isExpression: boolean;
}

export function parseFunction(code: Input, options?: Options): Result;
