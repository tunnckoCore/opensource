// SPDX-License-Identifier: MPL-2.0

export function pipeline(...fns) {
  return function runPipeline(argv) {
    const last = fns[fns.length - 1];
    const lastIsConfig = last && typeof last === 'object';
    const cfg = lastIsConfig ? { ...last } : {};
    let result = {};
    let flags = null;

    const plugins = lastIsConfig ? fns.slice(0, -1) : fns;

    for (const [i, plugin] of plugins.entries()) {
      const ret = plugin(flags || argv, result, { config: cfg, argv, flags });

      // first plugin is always the parser, it is passed argv array (process.argv),
      // and it returns the parsed arguments object (flags/options)
      // which will be passed to the next plugins
      if (i === 0) {
        flags = ret;
      }

      if (ret === false) {
        break;
      }

      result = { ...result, ...ret };
    }

    return result;
  };
}

export function defaults(config = {}) {
  return (flags, result) => {
    const res = { ...result };

    for (const key of Object.keys(config)) {
      res[key] = res[key] ?? config[key];
    }

    return res;
  };
}

export const aliases = alias;
export function alias(config = {}) {
  return (flags, result) => {
    const res = { ...result };

    for (const flagName of Object.keys(config)) {
      const alibi = [config[flagName]].flat();
      for (const key of alibi) {
        res[key] = res[flagName];
        res[flagName] = res[key];
      }
    }

    return res;
  };
}

export function coerce(config = {}) {
  return (flags, result) => {
    const res = { ...result };

    for (const key of Object.keys(config)) {
      const flagValue = res[key] ?? undefined;

      res[key] = flagValue ? config[key](flagValue) : undefined;

      if (Number.isNaN(res[key])) {
        throw new TypeError(`option "${key}" failed to be coerced correctly`);
      }
    }

    return res;
  };
}

export function required(config) {
  return (argv, result) => {
    const res = { ...result };

    if (Array.isArray(config)) {
      for (const requiredFlagName of config) {
        const isDefined = res[requiredFlagName] !== undefined;

        if (!isDefined) {
          throw new Error(`required option "${requiredFlagName}" is required`);
        }
      }
    }
    if (config && typeof config === 'object') {
      for (const flagName of Object.keys(config)) {
        const flagValue = res[flagName];
        const valueType = typeof flagValue;
        let def = config[flagName];
        const isDefined = res[flagName] !== undefined;

        if (def === true && !isDefined) {
          throw new Error(`required option "${flagName}" is not passed`);
        }
        if (typeof def === 'string') {
          def = { type: def };
        }
        if (isDefined && def && def.type && valueType !== def.type) {
          throw new Error(
            `required option "${flagName}" expect value of type "${def.type}", but "${valueType}" given`,
          );
        }
        if (typeof def === 'function') {
          const ret = def(flagName, flagValue, valueType);
          if (ret !== true) {
            throw new Error(`required option "${flagName}" failed validation`);
          }
        }
      }
    }

    return res;
  };
}

export const plugins = [defaults, aliases, coerce, required];
export const plugin = {
  defaults,
  aliases,
  alias,
  coerce,
  required,
};
