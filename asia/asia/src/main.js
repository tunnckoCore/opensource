// SPDX-License-Identifier: MPL-2.0

import Cache from './cache.js';

export default async function main(settings = {}) {
  const { cwd, path, fs, env, asia, loadConfig, nextTick } = settings;
  const configPath = path.resolve(cwd, 'asia.config.js');
  const config = await loadConfig(configPath);
  const cfg = { cwd, path, fs, env, ...config };

  const cache = env.ASIA_NO_CACHE === '1' ? new Map() : new Cache(cfg);

  if (env.ASIA_NO_AUTORUN === undefined) {
    // eslint-disable-next-line no-unused-expressions
    cache.prepare && (await cache.prepare());
  }
  if (env.ASIA_RELOAD === '1') {
    await cache.clear();
  }
  // console.log("config", config);
  const { test, run } = asia({
    tests: cache,
    env,
    ...config,
  });

  if (env.ASIA_NO_AUTORUN === undefined) {
    const start = async () => {
      await run();
    };

    if (nextTick) {
      nextTick(start);
    } else {
      setTimeout(start, 0);
    }
  }

  return {
    cwd,
    test,
    run,
    env,
    cache,
    Cache,
    config,
    configPath,
  };
}
