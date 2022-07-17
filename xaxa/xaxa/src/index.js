/* eslint-disable no-param-reassign */
// SPDX-License-Identifier: Apache-2.0

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { ESLint } from 'eslint';
import globCache from 'glob-cache';
import { yaro } from 'yaro';
import { getESLintConfig } from 'eslint-config-xaxa/src/main.js';
// import loadProgram from './program.js';

export const DEFAULT_IGNORE = [
  '**/node_modules/**',
  '**/bower_components/**',
  '**/flow-typed/**',
  '**/coverage/**',
  '**/{tmp,temp}/**',
  '**/*.min.js',
  '**/bundle.js',
  '**/.cache/**',
  '**/{fixture,fixtures}/**',
  '**/vendor/**',
  '**/dist/**',
];

let eslintCachedInstance = null;

export const DEFAULT_PATTERNS = ['**/*.js', '**/*.mjs'].concat(
  DEFAULT_IGNORE.map((x) => `!${x}`),
);

function arrayifiy(val) {
  if (!val) {
    return [];
  }
  if (Array.isArray(val)) {
    return val.flat();
  }
  return [val];
}

export async function command(options, prog) {
  if (options && options.isHela && options.isYaro) {
    prog = options;
    options = {};
  }
  const opts = { cwd: process.cwd(), ...options };

  prog = prog
    ? prog.singleMode('xaxa [...patterns] [options]')
    : yaro('xaxa [...patterns] [options]', {
        ...opts,
        helpByDefault: false, // note: we want to run with the default globs patterns
        allowUnknownOptions: true, // todo: does not respect it for some reason
        singleMode: true,
      })
        .option(
          '--cwd',
          'Working directory, defaults to `process.cwd()`.',
          opts.cwd,
        )
        .option('--verbose', 'Print more verbose output.', false);

  return prog
    .describe('Lint and format files with ESLint --fix and Prettier.')
    .alias('lnt', 'lints', 'lin', 'lint', 'litn', 'xaxa')
    .option('--log', 'Log per changed file', false) // todo: use for testing `allowUnknownOptions`
    .option('-f, --force', 'Force lint, cleaning the cache.', false)
    .option('-c, --config', 'Path to config file.', {
      default: 'xaxa.config.js',
      type: 'string',
      normalize: true,
    })
    .option('--workspace-file', 'File path to write workspaces metadata.', {
      default: 'hela-workspace.json',
      type: 'string',
      normalize: true,
    })
    .action(async ({ flags, patterns }, { globalOptions }) => {
      const lintOptions = { ...globalOptions, ...flags };

      if (lintOptions.verbose) {
        console.log('[xaxa]: linting...', patterns, lintOptions);
      }
      await lint(patterns, lintOptions);
    });
}

export async function lint(patterns, options) {
  const flags = { ...options };

  const eslintConfig = getESLintConfig(flags);

  const globs = arrayifiy(patterns);
  const input = globs.length > 0 ? globs : DEFAULT_PATTERNS;

  const results = [];
  const cacheLocation = path.join(flags.cwd, '.cache', 'xaxa-cache');

  if (flags.force === true) {
    try {
      await fs.rm(cacheLocation, { recursive: true });
    } catch {}
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  let verifyCache = () => {};

  await globCache.promise({
    include: input,
    cacheLocation,
    hooks: {
      async changed({ file, cacache }) {
        if (flags.log) {
          console.log('linted:', file.path);
        }
        const { filePath, messages, source } = await lintFile(file, {
          ...flags,
          eslintConfig,
        });

        const lintResult = { filePath, messages };

        // we update the cache, with also including a metadata (the lint results)
        await cacache.put(cacheLocation, file.path, source, {
          metadata: lintResult,
        });

        results.push(lintResult);
      },

      // if file not changed, then the results cache would not be changed too
      // so we get the results cache file to put it on reports
      async notChanged({ file, cacache }) {
        if (flags.log) {
          console.log('skipped:', file.path);
        }

        const info = await cacache.get.info(cacheLocation, file.path);
        if (info) {
          results.push(info.metadata);
        }

        // NOTE: in case the content exists in cache, but it's with different key
        if (!info && flags.verbose) {
          console.log(
            'File skipped for some reason and no cache: %s',
            file.path,
          );
        }
      },

      async always({ cacache }) {
        verifyCache = verifyCache || cacache.verify;
      },
    },
  });

  await verifyCache(cacheLocation);

  const res = results.flat().filter(Boolean);
  const problemsCount = res.reduce((acc, x) => acc + x.messages.length, 0);

  const lintedCount = res.length;

  console.log('Found %s problem(s) in %s file(s).', problemsCount, lintedCount);
}

export async function lintFile(filename, options) {
  const opts = { writeFixed: true, ...options };
  const file = typeof filename === 'string' ? { path: filename } : filename;

  if (!file.contents) {
    file.contents = await fs.readFile(file.path, 'utf8');
  }
  // because we can be passed a buffer, thus forcing utf8
  const source = file.contents.toString('utf8');
  const { messages, output } = await lintText(source, {
    ...opts,
    filepath: file.path,
  });

  const result = {
    filePath: file.path,
    messages,
    source,
    output,
    fixed: Boolean(output),
  };

  if (result.fixed && opts.writeFixed === true) {
    await fs.writeFile(file.path, output);
  }

  return result;
}

export async function lintText(text, options) {
  const opts = { ...options };

  // if cached between runs, get it.
  // otherwise get the passed from the options
  const eslintInstance = eslintCachedInstance ?? opts.eslint;

  // if not cached, and not passed, then initialize
  const eslint =
    eslintInstance ??
    new ESLint({
      baseConfig: opts.eslintConfig || opts.baseConfig,
      cwd: opts.cwd || process.cwd(),
      reportUnusedDisableDirectives: 'error',

      // minimize eslint stuff, we are dealing with that.
      useEslintrc: false,
      ignore: false,
      fix: true,
    });

  eslintCachedInstance = eslint;

  const filePath = opts.filename || opts.filePath || opts.filepath;
  const [{ messages, output }] = await eslintCachedInstance.lintText(text, {
    filePath,
  });

  const result = {
    filePath,
    messages,
    output,
  };

  return result;
}

export {
  getESLintConfig,
  loadConfigFromWorkspace,
  readJSON,
} from 'eslint-config-xaxa/src/main.js';
