/*
  Copyright © 2019 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/

'use strict';

const { parsers } = require('prettier/parser-babel');
const sortPackageJson = require('sort-package-json');

const parser = parsers['json-stringify'];

// const { dependencies } = require('./rules/dependencies');
// const { engines } = require('./rules/engines');
// const { files } = require('./rules/files');
// const { scripts } = require('./rules/scripts');
// const { sort } = require('./rules/sort');

// const { 'json-stringify': parser } = parsers;
// const { parse } = parser;

// const format = (properties) => {
//   let props = sort(properties);
//   props = engines(props);
//   props = files(props);
//   props = scripts(props);
//   props = dependencies(props);

//   return props;
// };

module.exports = {
  name: 'prettier-plugin-pkgjson',
  parsers: {
    'json-stringify': {
      ...parser,
      parse(text, _, options) {
        let txt = text;

        if (options.filepath && /package\.json$/.test(options.filepath)) {
          txt = sortPackageJson(txt, {
            sortOrder: [
              'private',
              'name',
              'version',

              // custom to @tunnckoCore for docs generation
              'licenseStart',

              // important to be in the top in a visible place
              // because in ton of cases there are no badges or signals in the README
              'license',

              'description',

              // only in monorepo setups, where the root package.json
              // doesn't have anything of below until `scripts` and `dependencies`
              'workspaces',

              // Usually not obects
              'author',
              'homepage',

              // npm funding support
              // it can be an object or a string
              'funding',

              'repository',

              // Node.js ESM Support
              'type',
              'exports',

              // inputs / outputs
              'src',
              'main',
              'umd:main',
              'umd:name',
              'jsdelivr',
              'unpkg',
              'module',
              'source',
              'jsnext:main',
              'browser',

              // TypeScript
              'types',
              'typings',

              // objects & arrays
              'files',
              'bin',
              'engines',
              'publishConfig',
              'scripts',

              // dependenices and yarn resolutions, plus Yarn v2
              'resolutions',
              'dependencies',
              'devDependencies',
              'peerDependencies',
              'peerDependenciesMeta',
              'optionalDependencies',
              'bundledDependencies',
              'bundleDependencies',

              // custom to @tunnckoCore
              'hela',
              'meta',

              // Jest config (on per package, and in the root too)
              'jest',

              // custom to @tunnckoCore
              'cov',

              'bugs',

              // the rest not defined here and after the `keywords`
              // will be formatted by sort-package-json
              'keywords',
            ],
          });
        }

        return parser.parse(txt, _, options);
      },
    },
  },
};
