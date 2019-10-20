'use strict';

const fs = require('fs');
const util = require('util');
const path = require('path');
const utils = require('./utils');

module.exports = function plugin(app) {
  if (!utils.isValid(app, 'verb-repo-helpers')) return;

  app.helper('relative', function(dest) {
    return dest !== this.app.cwd ? path.relative(dest, this.app.cwd) : './';
  });

  app.asyncHelper('section', function(name, locals, cb) {
    if (typeof locals === 'function') {
      cb = locals;
      locals = {};
    }

    const view = app.includes.getView(name);
    let fallback = '';

    if (typeof locals === 'string') {
      fallback = locals;
    }

    if (view === void 42) {
      cb(null, fallback);
      return;
    }

    app.render(view, locals, function(err, res) {
      if (err) {
        cb(err);
        return;
      }
      cb(null, res.content);
    });
  });

  app.asyncHelper('block', function(name, options, cb) {
    app.include(name, options.fn(this));
    cb(null, '');
  });

  /**
   * async helpers
   */

  app.asyncHelper('related', function(...args) {
    return utils.related(this.options).call(this, ...args);
  });

  app.asyncHelper('reflinks', function(...args) {
    return utils.reflinks(this.options).call(this, ...args);
  });

  /**
   * GitHub helpers, namespaces on the `gh` object
   */

  app.helperGroup(
    'gh',
    {
      contributors: function contribs(repo, options, cb) {
        if (typeof repo === 'function') {
          return contribs.call(this, null, {}, repo);
        }
        if (typeof options === 'function') {
          return contribs.call(this, repo, {}, options);
        }
        if (typeof repo !== 'string') {
          options = repo;
          repo = null;
        }

        const opts = Object.assign({ format: 'table' }, this.options, options);
        const format = opts.format;
        opts.format = 'noop';

        delete opts.lookup;

        repo = repo || this.context.repository;
        if (!repo) {
          cb();
          return;
        }

        utils.contributors(repo, opts, function(err, people) {
          if (err) {
            cb(err);
            return;
          }

          if (people.length === 0) {
            cb(null);
            return;
          }

          if (people.length === 1 && opts.singleContributor !== true) {
            cb(null, '');
            return;
          }

          opts.format = format;
          cb(null, utils.formatPeople(people, opts));
        });
      },
    },
    true,
  );

  /**
   * Create a GitHub issue linke
   */

  app.helper('issue', function(options) {
    const ctx = utils.merge({}, this.context, options);
    ctx.owner = ctx.owner || (ctx.author ? ctx.author.username : '');
    ctx.repo = ctx.name;
    return utils.issue(ctx);
  });

  /**
   * Return `val` if a file or one of the given `files` exists on the file system.
   *
   * ```html
   * <%= ifExists(['foo.js', 'bar.js'], doSomething) %>
   * ```
   * @param {String|Array} `files`
   * @param {any} `val` The value to return if one of the given `files` exists
   * @param {Function} `cb` Callback
   * @api public
   */

  app.asyncHelper('ifExists', function(files, val, cb) {
    // ! next line is the only needed patch
    val = typeof val === 'function' ? val() : val;

    cb(null, utils.anyExists(files, this.app.cwd) ? val : '');
  });

  /**
   * Include template `name`
   *
   * ```html
   * <%= maybeInclude('foo', doSomething) %>
   * ```
   * @param {String|Array} `files`
   * @param {any} `val` The value to return if one of the given `files` exists
   * @param {Function} `cb` Callback
   * @api public
   */

  app.asyncHelper('maybeInclude', function(name, helperName, cb) {
    if (typeof helperName === 'function') {
      cb = helperName;
      helperName = 'include';
    }

    const opts = Object.assign({}, this.options, this.context);
    if (opts[name]) {
      const fn = this.app.getAsyncHelper(helperName);
      return fn.apply(this, arguments);
    }

    cb(null, '');
  });

  /**
   * Get a package.json from npm's API
   */

  app.asyncHelper('pkg', function fn(name, prop, cb) {
    if (typeof prop === 'function') {
      cb = prop;
      prop = null;
    }

    if (fn[name]) {
      cb(null, prop ? utils.get(fn[name], prop) : fn[name]);
      return;
    }

    utils
      .getPkg(name)
      .then((pkg) => {
        const res = prop ? utils.get(pkg, prop) : pkg;
        fn[name] = pkg;
        cb(null, res);
      })
      .catch(cb);
  });

  app.asyncHelper('read', function(fp, cb) {
    fs.readFile(fp, 'utf8', cb);
  });

  /**
   * sync helpers
   */

  app.helper('require', function(name) {
    try {
      return require(name);
    } catch (err) {
      /* do nothing */
    }
    try {
      return require(path.resolve(name));
    } catch (err) {
      /* do nothing */
    }
    return '';
  });

  // date helper
  app.helper('date', function(...args) {
    return utils.date.call(this, ...args);
  });

  app.helper('apidocs', function(...args) {
    const fn = utils.apidocs(this.options);
    return fn.call(null, ...args);
  });

  app.helper('copyright', function(...args) {
    const fn = utils.copyright({ linkify: true });
    return fn.call(this, ...args);
  });

  /**
   * Display a commented line of code
   */

  app.helper('results', function(val) {
    const fn = require(require.resolve(this.app.cwd));
    const lines = util.inspect(fn(val)).split('\n');
    return lines.map((line) => `//${line}`).join('\n');
  });

  app.helper('previous', function(increment, val) {
    const segs = String(val).split('.');
    let version = '';
    switch (increment) {
      case 'major':
        version = segs[0] - 1 + '.0.0';
        break;
      case 'minor':
      default: {
        version = segs[0] + '.' + (segs[1] - 1) + '.0';
        break;
      }
    }
    return version;
  });

  return plugin;
};
