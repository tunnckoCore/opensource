const mri = require('mri');
const $ = require('./utils');

const ALL = '__all__';
const DEF = '__default__';

class Sade {
  constructor(name, isOne) {
    const [bin, ...rest] = name.split(/\s+/);
    isOne = isOne || rest.length > 0;

    this.bin = bin;
    this.ver = '0.0.0';
    this.default = '';
    this.tree = new Map();
    this.commandAliases = new Map();
    // set internal shapes;
    this.command(ALL);
    this.command([DEF].concat(isOne ? rest : '<command>').join(' '));
    this.single = isOne;
    this.curr = ''; // reset
  }

  command(str, desc, opts = {}) {
    if (this.single) {
      throw new Error('Disable "single" mode to add commands');
    }

    // All non-([|<) are commands
    let cmd = [];
    let usage = [];
    const rgx = /(\[|<)/;
    str.split(/\s+/).forEach((x) => {
      (rgx.test(x.charAt(0)) ? usage : cmd).push(x);
    });

    // Back to string~!
    cmd = cmd.join(' ');

    if (this.tree.has(cmd)) {
      throw new Error(`Command already exists: ${cmd}`);
    }

    // re-include `cmd` for commands
    cmd.includes('__') || usage.unshift(cmd);
    usage = usage.join(' '); // to string

    this.curr = cmd;
    if (opts.default) this.default = cmd;

    const cmdData = {
      usage,
      options: [],
      alias: {},
      default: {},
      examples: [],
    };
    const cmdAliases = [].concat(opts.alias).filter(Boolean);

    this.tree.set(cmd, cmdData);

    if (desc) this.describe(desc);

    this.commandAliases.set(cmd, cmdAliases);

    return this;
  }

  describe(str) {
    const key = this.curr || DEF;
    const command = this.tree.get(key);

    command.describe = Array.isArray(str) ? str : $.sentences(str);

    this.tree.delete(key);
    this.tree.set(key, command);
    return this;
  }

  option(str, desc, val) {
    const key = this.curr || ALL;
    const cmd = this.tree.get(key);

    let [flag, alias] = $.parse(str);
    if (alias && alias.length > 1) [flag, alias] = [alias, flag];

    str = `--${flag}`;
    if (alias && alias.length > 0) {
      str = `-${alias}, ${str}`;
      const old = cmd.alias[alias];
      cmd.alias[alias] = (old || []).concat(flag);
    }

    const arr = [str, desc || ''];

    if (val !== void 0) {
      arr.push(val);
      cmd.default[flag] = val;
    } else if (!alias) {
      cmd.default[flag] = void 0;
    }

    cmd.options.push(arr);

    this.tree.delete(key);
    this.tree.set(key, cmd);
    return this;
  }

  action(handler) {
    const key = this.curr || DEF;
    const command = this.tree.get(key);
    command.handler = handler;

    this.tree.delete(key);
    this.tree.set(key, command);
    return this;
  }

  example(str) {
    const key = this.curr || DEF;
    const command = this.tree.get(key);

    command.examples.push(str);

    this.tree.delete(key);
    this.tree.set(key, command);
    return this;
  }

  version(str) {
    this.ver = str;
    return this;
  }

  parse(arr, opts = {}) {
    let offset = 2; // argv slicer
    const alias = { h: 'help', v: 'version' };
    const argv = mri(arr.slice(offset), { alias });
    const isSingle = this.single;
    let { bin } = this;
    let tmp;
    let name = '';
    let isVoid;
    let cmd;

    const existsAsAlias = (val) => {
      let found = false;

      this.commandAliases.forEach((aliases) => {
        found = aliases.includes(val);
      });

      return found;
    };

    if (isSingle) {
      cmd = this.tree.get(DEF);
    } else {
      // Loop thru possible command(s)
      let i = 1;
      const len = argv._.length + 1;
      for (; i < len; i++) {
        tmp = argv._.slice(0, i).join(' ');

        if (existsAsAlias(tmp) || this.tree.has(tmp)) {
          name = tmp;
          offset = i + 2; // argv slicer
        }
      }

      // create commands from aliases for every command's alias
      [...this.commandAliases.entries()].forEach(([name, aliases]) => {
        const command = this.tree.get(name);

        aliases.forEach((aliasName) => {
          this.tree.set(aliasName, command);
        });
      });

      cmd = this.tree.get(name);
      isVoid = cmd === void 0;

      if (isVoid) {
        if (this.default) {
          name = this.default;
          cmd = this.tree.get(name);
          arr.unshift(name);
          offset++;
        } else if (tmp) {
          return $.error(bin, `Invalid command: ${tmp}`);
        } //= > else: cmd not specified, wait for now...
      }
    }

    // show main help if relied on "default" for multi-cmd
    if (argv.help) return this.help(!isSingle && !isVoid && name);
    if (argv.version) return this._version();

    if (!isSingle && cmd === void 0) {
      return $.error(bin, 'No command specified.');
    }

    const all = this.tree.get(ALL);
    // merge all objects :: params > command > all
    opts.alias = Object.assign(all.alias, cmd.alias, opts.alias);
    opts.default = Object.assign(all.default, cmd.default, opts.default);

    const vals = mri(arr.slice(offset), opts);
    if (!vals || typeof vals === 'string') {
      return $.error(bin, vals || 'Parsed unknown option flag(s)!');
    }

    const segs = cmd.usage.split(/\s+/);
    const reqs = segs.filter((x) => x.charAt(0) === '<');
    const args = vals._.splice(0, reqs.length);

    if (args.length < reqs.length) {
      if (name) bin += ` ${name}`; // for help text
      return $.error(bin, 'Insufficient arguments!');
    }

    segs
      .filter((x) => x.charAt(0) === '[')
      .forEach((_) => {
        args.push(vals._.shift()); // adds `undefined` per [slot] if no more
      });

    args.push(vals); // flags & co are last
    const { handler } = cmd;
    return opts.lazy ? { args, name, handler } : handler.apply(null, args);
  }

  help(str) {
    console.log($.help(this.bin, this.tree, str || DEF, this.single));
  }

  _version() {
    console.log(`${this.bin}, ${this.ver}`);
  }
}

module.exports = (str, isOne) => new Sade(str, isOne);
