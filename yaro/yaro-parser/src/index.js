// SPDX-License-Identifier: MPL-2.0

export const parse = yaro;
export function yaro(argv /* , config = {} */) {
  const REPLACER = '@@@@__REPLACE_VALUE__@@@@';
  const res = {};

  function set(name, value, replaceValue) {
    res[name] = res[name] || [];

    const idx = res[name].indexOf(REPLACER);
    if (replaceValue && idx !== -1) {
      res[name][idx] = value ?? true;
      return res;
    }

    res[name] = res[name].concat(value);

    return res;
  }

  let prev = null;
  let idx = 0;
  for (const arg of argv) {
    idx += 1;
    const isDashPositional = arg[0] === '-' && arg.length === 1;
    const isShort = arg[0] === '-' && arg[1] !== '-';
    const isLong = arg[0] === '-' && arg[1] === '-';
    const isDoubleDash = isLong && arg.length === 2;
    const isNegate = isLong && arg.indexOf('no-') > 0;
    const isExplicit = arg.includes('=');

    if (isDashPositional) {
      set('-', true);
      continue;
    }

    if (isDoubleDash) {
      set('--', argv.slice(idx));
      break;
    }

    const i = isExplicit ? arg.indexOf('=') : 0;
    if (isShort) {
      const key = isExplicit ? arg.slice(1, i) : arg.slice(1);
      if (isExplicit && key.length === 1) {
        set(key, arg.slice(i + 1) || true);
      } else if (key.length === 1) {
        prev = key;
        set(key, REPLACER);
      } else {
        key.split('').map((k) => set(k, true));
      }
      continue;
    }
    if (isLong) {
      const parts = arg.split('=');
      const key = (isExplicit ? parts[0] : arg).slice(isNegate ? 5 : 2);
      if (isNegate) {
        set(key, false);
        continue;
      }
      if (isExplicit) {
        set(key, parts[1] || true);
        continue;
      } else {
        prev = key;
        const isEql = key === arg.slice(2);

        if (isEql && isNegate) {
          set(key, false);
          continue;
        }

        set(key, REPLACER);
        continue;
      }
    }

    // it is a value
    if (prev && !isLong && !isShort) {
      set(prev, arg, true);
    }
  }

  return Object.entries(res).reduce((acc, [key, value]) => {
    if (value.length === 1) {
      acc[key] = value[0] === REPLACER ? true : value[0];
    } else {
      acc[key] = value.every((x) => x === true) ? value.length : value;
    }
    return acc;
  }, {});
}

export function parser(config = {}) {
  return (argv) => yaro(argv, config);
}
