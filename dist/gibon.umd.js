(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.gibon = factory());
}(this, (function () { 'use strict';

/*!
 * gibon <https://github.com/tunnckoCore/gibon>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (http://i.am.charlike.online)
 * Released under the MIT license.
 */

function gibon (routes, dom) {
  return function app (model, onRoute) {
    onRoute = onRoute || (function (view, context) { return view(context); });

    return model ? _start : _start()

    function _start () {
      window.onpopstate = handler;
      handler();
      return dom
    }

    function handler (_re) {
      var loc = window.location;
      var pathname = loc.pathname.replace(/^\/+/, '/').replace(/\/+$/, '');
      pathname = pathname || '/';

      var context = {
        loc: loc,
        params: {},
        pathname: pathname
      };

      if (routes[pathname]) {
        dom = onRoute(routes[pathname], context, dom, model);
      }

      for (var route in routes) {
        _re = regexify(route);
        if (_re.regex.test(pathname)) {
          pathname.replace(_re.regex, function () {
            var arguments$1 = arguments;

            for (var i = 1; i < arguments.length - 2; i++) {
              context.params[_re.keys.shift()] = arguments$1[i];
            }
            _re.match = 1;
          });

          if (_re.match) {
            dom = onRoute(routes[route], context, dom, model);
            break
          }
        }
      }
    }
  }
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

return gibon;

})));
