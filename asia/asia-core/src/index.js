// SPDX-License-Identifier: MPL-2.0

import { parallel, serial } from '@tunnckocore/p-all';
import * as utils from './utils.js';

export const loadConfig = async (configPath) => {
  let config = {};

  try {
    config = await import(configPath);
  } catch {
    config = {};
  }

  config =
    typeof config.default === 'function'
      ? await config.default()
      : await config.default;

  return { ...config };
};

export default function asia(settings = {}) {
  const cfg = { ...settings };
  const specs = [];
  const tests = cfg.tests || new Map();

  cfg.filter = typeof cfg.filter === 'function' ? cfg.filter : utils.filter;

  function test(title, fn) {
    const callsites = utils.callplaces();
    const testPath = callsites[1].getFileName();
    const fnString = String(fn);

    const handler = async () => {
      const filterFn = cfg.filter;

      // remove from cache so it skips next check and runs the test fn again
      if (filterFn(cfg, { title, testPath, callsites, fnString })) {
        await tests.delete(title);
      }

      if (await tests.has(title)) {
        const item = await tests.get(title);

        if (fnString === item.fnString) {
          if (item.error) {
            throw item;
          }
          return item;
        }
      }

      try {
        await fn();
      } catch (err) {
        const rejected = {
          ...err,
          error: true,
          message: err.message,
          stack: utils.cleanerStack(err.stack),
          fnString,
          title,
        };

        await tests.set(title, rejected);
        throw rejected;
      }

      const resolved = { fnString, title };
      await tests.set(title, resolved);
      return resolved;
    };

    specs.push(handler);
  }

  async function run() {
    // for older env:
    // cfg.afterEach = cfg.afterEach ? cfg.afterEach : mapper;
    cfg.afterEach = cfg.afterEach ?? ((item) => utils.basicReporter(item, cfg));
    // cfg.finish = () => console.log("done");
    // for newer:
    // cfg.afterEach ??= mapper;

    return cfg.serial ? serial(specs, cfg) : parallel(specs, cfg);
  }

  return { test, run };
}
export { each, parallel, serial } from '@tunnckocore/p-all';
