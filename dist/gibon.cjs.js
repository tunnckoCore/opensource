'use strict';

/*!
 * gibon <https://github.com/tunnckoCore/gibon>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (http://i.am.charlike.online)
 * Released under the MIT license.
 */

var index = function (routes, hash) { return function start () {
  hash = !(history && history.pushState); // eslint-disable-line no-undef
  if (hash) { throw new Error('Not supported') }

  var dom = document.createElement('p');
  var handler = function (_re) {
    var loc = window.location;
    var pathname = normalize(loc.pathname);
    var context = {
      loc: loc,
      params: {},
      pathname: pathname
    };

    for (var route in routes) {
      if (routes[pathname]) {
        return (dom = routes[pathname](context))
      }
      _re = regexify(route);
      if (_re.regex.test(pathname)) {
        pathname.replace(_re.regex, function () {
          var arguments$1 = arguments;

          for (var i = 1; i < arguments.length - 2; i++) {
            context.params[_re.keys.shift()] = arguments$1[i];
          }
          _re.match = true;
        });

        if (_re.match) {
          return (dom = routes[route](context))
        }
      }
    }
  };

  window.onpopstate = handler;
  handler();

  return dom
}; };

function normalize (s) {
  return s === '/' ? s : s.replace(/^\/+/, '/').replace(/\/+$/, '')
}

function regexify (route, _regex) {
  var keys = [];
  _regex = '^' + route
    .replace(/\//g, '\\/')
    .replace(/:(\w+)/g, function (_, name) {
      keys.push(name);
      return '(\\w+)'
    }) + '$';

  return {
    regex: new RegExp(_regex, 'i'),
    keys: keys
  }
}

module.exports = index;
//# sourceMappingURL=gibon.cjs.js.map
