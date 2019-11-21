import { resolveConfig, resolveConfigPath } from './utils.js';

export { resolveConfig, resolveConfigPath };

export const searchPlaces = [
  '%s.config.js', // 7
  '.%s.config.js', // 7
  'package.json', // 12 - pkg.eslint || pkg.eslintConfig || pkg.config.eslint
  '.%src.json', // 1
  // '.%src.json6', // 2
  '.%src.yaml', // 3
  '.%src.yml', // 4
  '.%src.js', // 5
  // '.%src.mjs', // 6
  // '%s.config.mjs', // 8
  '.%s.config.js', // 9
  // '.%s.config.mjs', // 10
  '.%src', // 11 - first try JSON, if fail to parse then fallback to YAML
];

export async function prettyConfig(name, options) {
  if (typeof name !== 'string') {
    throw new TypeError('pretty-config: `name` is required argument');
  }
  if (name.length === 0) {
    throw new Error('pretty-config: expect `name` to be non-empty string');
  }

  const opts = {
    cwd: process.cwd(),
    name,
    searchPlaces,
    envSupport: true,
    ...options,
  };
  const configPath = resolveConfigPath(opts);

  // we return empty object,
  // because we don't have any config
  // and no errors
  if (!configPath) {
    return null;
  }

  const cfg = await resolveConfig(configPath, opts);
  const envName = process.env.NODE_ENV;

  if (opts.envSupport && cfg && cfg.env && cfg.env[envName]) {
    const config = { ...cfg, ...cfg.env[envName] };
    return { config, filepath: configPath };
  }

  return { config: cfg, filepath: configPath };
}

prettyConfig.searchPlaces = searchPlaces;

export default prettyConfig;
