import fs from 'fs';
import path from 'path';
import util from 'util';

import yaml from 'yaml';
import JSON6 from 'json-6';

export function resolveConfigPath(opts) {
  const configFilepath = opts.searchPlaces.reduce((configPath, fp) => {
    // really, hit fs only once, we don't care
    // if there is more existing config files,
    // we care about the first found one
    if (configPath.length > 0) {
      return configPath;
    }

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const resolvePath = (filePath) => path.resolve(opts.cwd, filePath);

    let filepath = fp;
    if (filepath === 'package.json') {
      filepath = resolvePath(filepath);
    } else {
      filepath = resolvePath(util.format(filepath, opts.name));
    }

    let cfgPath = configPath;
    if (fs.existsSync(filepath)) {
      cfgPath += filepath;
    }

    return cfgPath;
  }, '');

  return configFilepath;
}

export async function resolveConfig(configPath, opts) {
  const contents = await util.promisify(fs.readFile)(configPath, 'utf8');

  // 1) if `.eslintrc.json` or `.eslintrc.json6`
  if (/\.json6?/.test(configPath) && !configPath.endsWith('package.json')) {
    const json = configPath.endsWith('.json6') ? JSON6 : JSON;
    return json.parse(contents);
  }

  // 2) if `.eslintrc.yaml` or `.eslintrc.yml`
  if (/\.ya?ml$/.test(configPath)) {
    return yaml.parse(contents);
  }

  // 3) if one of those (depends on `configFiles` order)
  // Note: Both CommonJS and ESModules are possible :)
  // - 3.1) `.eslintrc.js`
  // - 3.2) `.eslintrc.mjs`
  // - 3.3) `eslint.config.js`
  // - 3.4) `eslint.config.mjs`
  // - 3.5) `.eslint.config.js`
  // - 3.6) `.eslint.config.js`
  if (/\.m?js$/.test(configPath)) {
    const esmLoader = await import('esm').then((x) => x.default);
    const config = esmLoader(module)(configPath);
    return config;
  }

  // 4) if `.eslintrc`:
  // - 4.1) try to parse as JSON first, otherwise
  // - 4.2) try to parse as YAML
  if (configPath.endsWith('rc')) {
    try {
      return JSON.parse(contents);
    } catch (err) {
      if (err.name === 'SyntaxError') {
        return yaml.parse(contents);
      }
      throw err;
    }
  }

  // 5) if config in package.json:
  const pkg = JSON.parse(contents);

  // - 5.1) pkg.eslint
  return (
    pkg[opts.name] ||
    // - 5.2) pkg.eslintConfig
    pkg[`${opts.name}Config`] ||
    // - 5.3) pkg.config.eslint
    (pkg.config && pkg.config[opts.name]) ||
    // - 5.4) otherwise falsey value
    null
  );
}
