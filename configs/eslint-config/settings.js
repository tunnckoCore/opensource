'use strict';

const { createAliases } = require('@tunnckocore/utils');

const { alias, workspaces } = createAliases();

const importResolverAliasMap = Object.keys(alias).reduce((acc, key) => {
  const value = alias[key];

  acc.push([key, value]);

  return acc;
}, []);

const EXTENSIONS = ['.mjs', '.cjs', '.js', '.jsx', '.md', '.mdx', '.json'];

module.exports = {
  node: {
    allowModules: Object.keys(alias),
    tryExtensions: EXTENSIONS,
  },
  'import/resolver': {
    node: {
      paths: workspaces,
      extensions: EXTENSIONS,
      tryExtensions: EXTENSIONS,
      moduleDirectory: ['node_modules']
        .concat(workspaces)
        .concat(Object.values(alias)),
    },
    alias: {
      map: importResolverAliasMap,
      extensions: EXTENSIONS,
    },
  },
  'import/extensions': EXTENSIONS,
  'import/core-modules': ['electron', 'atom'],
};
