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

export function defaults(config, _aliases) {
  return (flags, result) => {
    const alis = { ..._aliases };
    const cfg = { ...config };
    const res = { ...result };

    for (const [name, value] of Object.entries(cfg)) {
      res[name] = flags[name] ?? res[name] ?? value;
      // const foo = res[name];

      const alibis = alis[name];

      for (const k of alibis) {
        res[k] = res[k] === res[name] ? res[k] : res[name];
        res[name] = res[k];
      }
    }

    return res;
  };
}

export const aliases = alias;
export function alias(config, _defaults) {
  return (flags, result) => {
    const defs = { ..._defaults };
    const cfg = { ...config };
    const res = { ...result };

    for (const [name, _aliases] of Object.entries(cfg)) {
      res[name] = res[name] ?? defs[name] ?? flags[name];
      for (const k of _aliases) {
        res[k] = flags[name] ?? flags[k] ?? res[name];
        res[name] = res[k];
      }
    }

    return res;
  };
}

export function coerce(config, _aliases) {
  return (flags, result) => {
    const alis = { ..._aliases };
    const cfg = { ...config };
    const res = { ...result };
    const keys = Object.keys(cfg).sort((a, b) => b.length - a.length);

    for (const k of keys) {
      const flagValue = res[k] ?? flags[k] ?? undefined;
      const fn = typeof cfg[k] === 'function' ? cfg[k] : () => flagValue;

      res[k] = fn(flagValue);

      if (Number.isNaN(res[k])) {
        const names = namePair(alis, k);
        throw new TypeError(`option "${names}" failed to be coerced correctly`);
      }
    }

    return res;
  };
}

export function required(config, _aliases) {
  return (flags, result) => {
    const alis = { ..._aliases };
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
        const valType = typeof flagValue;
        let def = config[flagName];
        const isDefined = res[flagName] !== undefined;
        const isDifferent = res[flagName] !== flags[flagName];

        if (def === true && !isDefined) {
          throw new Error(`required option "${flagName}" is not passed`);
        }
        if (typeof def === 'string') {
          def = { type: def };
        }
        if (isDefined && def && def.type && valType !== def.type) {
          throw new Error(
            `required option "${flagName}" expect value of type "${def.type}", but "${valType}" given`,
          );
        }
        if (typeof def === 'function') {
          let ret = def({
            flagName,
            flagValue,
            isDefined,
            flagType: valType,
            flag: res[flagName],
            passed: flags[flagName],
            isDifferent,
          });
          // console.log('zzzzz', ret);
          // note: temporary type casting for booleans
          if (typeof ret === 'function') {
            res[flagName] = ret(res[flagName]);
            ret = true;
          }
          if (ret !== true) {
            const names = namePair(alis, flagName);
            throw new Error(`required option "${names}" failed validation`);
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

export function isRequired({ flagValue, isDefined, flagType }) {
  const val = Number(flagValue);

  return (
    Number.isNaN(val) &&
    typeof val === 'number' &&
    isDefined &&
    flagType === 'string'
  );
}

function namePair(ali, k) {
  return [k, ali[k]]
    .flat()
    .filter(Boolean)
    .map((x) => (x.length === 1 ? `-${x}` : `--${x}`))
    .join(',');
}
