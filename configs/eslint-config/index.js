// const path = require('path');
const { createAliases } = require('@tunnckocore/utils');

const CWD = process.cwd();
const { alias } = createAliases(CWD, '');

// console.log(alias, extensions);

const unicornRules = {
  // It is too much annoyance for me. It's a good thing, but generally
  // after so many years we already name things properly,
  // so please don't mess with me and don't correct me.
  'unicorn/prevent-abbreviations': 'off',

  // These below are intentional & explicit overrides of XO and Unicorn

  // ! needed for `unicorn/no-unreadable-array-destructuring`
  'prefer-destructuring': ['error', { object: true, array: false }],
  'unicorn/no-unreadable-array-destructuring': 'error', // default in recommended

  'unicorn/no-unused-properties': 'error',
  // Disallow unsafe regular expressions.
  // Don't allow potential catastrophic crashes, slow behaving and downtimes.
  // You still can disable that and do whatever you want,
  // but that will be explicit and visible.
  // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-unsafe-regex.md
  'unicorn/no-unsafe-regex': 'error',

  // Enforce importing index files with `.` instead of `./index`. (fixable)
  // But we should be explicit. We know it is working without that,
  // but at least it is good for newcomers.
  // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/import-index.md
  'unicorn/import-index': 'off',

  // Enforce proper Error subclassing. (fixable)
  // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/custom-error-definition.md
  'unicorn/custom-error-definition': 'error',

  // Pretty useful rule, but it depends.
  // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/filename-case.md
  'unicorn/filename-case': 'off',

  // It is pretty common to name it `err`, and there is almost no reason to be any other.
  // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/catch-error-name.md
  'unicorn/catch-error-name': ['error', { name: 'err' }],
};

// Sindre's XO and mine preferences too.
const promiseRules = {
  // These below are to ensure not changes
  // inside upstream XO and the plugin:promise/recommended configs
  'promise/catch-or-return': 'off',
  'promise/always-return': 'off',
  'promise/no-native': 'off',
  'promise/no-nesting': 'off',
  'promise/no-promise-in-callback': 'off',
  'promise/no-callback-in-promise': 'off',
  'promise/avoid-new': 'off',
  'promise/prefer-await-to-then': 'error',
  'promise/prefer-await-to-callbacks': 'error',

  // These are the same as in XO CLI, but they are not in the eslint-config-xo
  'promise/no-return-wrap': ['error', { allowReject: true }],
  'promise/param-names': 'error',
  'promise/no-new-statics': 'error',
  'promise/no-return-in-finally': 'error',
  'promise/valid-params': 'error',
};

// These are the same as in XO CLI, but they are not in the eslint-config-xo
const importRules = {
  'import/namespace': ['error', { allowComputed: true }],
  'import/no-absolute-path': 'error',
  'import/no-webpack-loader-syntax': 'error',
  'import/no-self-import': 'error',

  // Enable this sometime in the future when Node.js has ES2015 module support
  // 'import/no-cycle': 'error'

  'import/no-useless-path-segments': ['error', { noUselessIndex: true }],

  // Disabled as it doesn't work with TypeScript
  // 'import/newline-after-import': 'error',

  'import/no-amd': 'error',
  'import/no-duplicates': 'error',

  // Enable this sometime in the future when Node.js has ES2015 module support
  // 'import/unambiguous': 'error',

  // Enable this sometime in the future when Node.js has ES2015 module support
  // 'import/no-commonjs': 'error',

  // Looks useful, but too unstable at the moment
  // 'import/no-deprecated': 'error',

  'import/no-extraneous-dependencies': 'off',
  'import/no-mutable-exports': 'error',
  'import/no-named-as-default-member': 'error',
  'import/no-named-as-default': 'error',

  // Disabled because it's buggy and it also doesn't work with TypeScript
  // 'import/no-unresolved': [
  // 	'error',
  // 	{
  // 		commonjs: true
  // 	}
  // ],

  'import/order': 'error',
  'import/no-unassigned-import': [
    'error',
    { allow: ['@babel/polyfill', '@babel/register'] },
  ],
};

// These are the same as in XO CLI, but they are not in the eslint-config-xo.
// They are also Airbnb and mine preferences.
const nodeRules = {
  'node/no-deprecated-api': 'error',
  'node/no-exports-assign': 'error',
  'node/no-unpublished-bin': 'error',

  // Redundant with import/no-extraneous-dependencies
  // 'node/no-extraneous-import': 'error',
  // 'node/no-extraneous-require': 'error',

  // Redundant with import/no-unresolved
  // 'node/no-missing-import': 'error',
  // 'node/no-missing-require': 'error',

  'node/no-unsupported-features/es-builtins': 'error',
  'node/no-unsupported-features/es-syntax': 'off',
  'node/no-unsupported-features/node-builtins': 'error',
  'no-process-exit': 'off',
  'node/process-exit-as-throw': 'error',
  'node/shebang': 'error',

  'node/exports-style': 'off',
  'node/file-extension-in-import': [
    'error',
    'never',
    {
      '.css': 'always',
      '.scss': 'always',
      '.sass': 'always',
      '.less': 'always',
      '.json': 'always',
    },
  ],
  'node/prefer-global/buffer': 'error',
  'node/prefer-global/console': 'error',
  'node/prefer-global/process': 'error',

  // These below will be enabled in XO when it targets Node.js 10
  'node/prefer-global/text-decoder': 'error',
  'node/prefer-global/text-encoder': 'error',
  'node/prefer-global/url-search-params': 'error',
  'node/prefer-global/url': 'error',
  'node/prefer-promises/dns': 'error',
  'node/prefer-promises/fs': 'error',
};

// These are the same as in XO CLI, but they are not in the eslint-config-xo.
const eslintCommentsRules = {
  // Disabled as it's already covered by the `unicorn/no-abusive-eslint-disable` rule
  'eslint-comments/no-unlimited-disable': 'off',
  'eslint-comments/disable-enable-pair': 'off',

  // Maybe consider it in future
  'eslint-comments/no-restricted-disable': 'off',

  'eslint-comments/no-use': [
    'error',
    {
      allow: [
        'eslint',
        'eslint-disable',
        'eslint-disable-line',
        'eslint-disable-next-line',
      ],
    },
  ],
};

const additionalChanges = {
  'no-extend-native': 'error',
  'no-use-extend-native/no-use-extend-native': 'error',

  'react/jsx-filename-extension': [
    'error',
    { extensions: ['.ts', '.tsx', '.js', '.jsx', '.mdx'] },
  ],

  strict: 'off',
  // Enforce using named functions when regular function is used,
  // otherwise use arrow functions
  'func-names': ['error', 'always'],
  // Always use parens (for consistency).
  // https://eslint.org/docs/rules/arrow-parens
  'arrow-parens': ['error', 'always', { requireForBlockBody: true }],
  'prefer-arrow-callback': [
    'error',
    { allowNamedFunctions: true, allowUnboundThis: true },
  ],
  // http://eslint.org/docs/rules/max-params
  'max-params': ['error', { max: 3 }],
  // http://eslint.org/docs/rules/max-statements
  'max-statements': ['error', { max: 20 }],
  // http://eslint.org/docs/rules/max-statements-per-line
  'max-statements-per-line': ['error', { max: 1 }],
  // http://eslint.org/docs/rules/max-nested-callbacks
  'max-nested-callbacks': ['error', { max: 4 }],
  // http://eslint.org/docs/rules/max-depth
  'max-depth': ['error', { max: 4 }],
  // enforces no braces where they can be omitted
  // https://eslint.org/docs/rules/arrow-body-style
  // Never enable for object literal.
  'arrow-body-style': [
    'error',
    'as-needed',
    { requireReturnForObjectLiteral: false },
  ],
  // Allow functions to be use before define because:
  // 1) they are hoisted,
  // 2) because ensure read flow is from top to bottom
  // 3) logically order of the code.
  // 4) the only addition is 'typedefs' option, see overrides for TS files
  'no-use-before-define': [
    'error',
    {
      functions: false,
      classes: true,
      variables: true,
    },
  ],
  // Same as AirBnB, but adds `opts`, `options`, `x` and `err` to exclusions!
  // disallow reassignment of function parameters
  // disallow parameter object manipulation except for specific exclusions
  // rule: https://eslint.org/docs/rules/no-param-reassign.html
  'no-param-reassign': [
    'error',
    {
      props: true,
      ignorePropertyModificationsFor: [
        'opts', // useful to ensure the params is always obect
        'options', // and when using Object.assign for shallow copy
        'x', // allow violating the rule in specific cases, instead of disabling it
        'acc', // for reduce accumulators
        'e', // for e.returnvalue
        'err', // for adding to the Error instance
        'ctx', // for Koa routing
        'req', // for Express requests
        'request', // for Express requests
        'res', // for Express responses
        'response', // for Express responses
        '$scope',
      ],
    },
  ],
};

const importResolverAlias = Object.keys(alias).reduce((acc, key) => {
  const value = alias[key];

  acc.push([key, value]);

  return acc;
}, []);

// console.log(importResolverAlias);

module.exports = {
  parser: 'babel-eslint',
  settings: {
    node: {
      allowModules: Object.keys(alias),
      tryExtensions: ['.ts', '.tsx', '.d.ts', '.js', '.jsx', '.mdx', '.json'],
    },
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx', '.d.ts', '.js', '.jsx', '.mdx', '.json'],
      },
      alias: importResolverAlias,
      // [
      //   ['babel-polyfill', 'babel-polyfill/dist/polyfill.min.js'],
      //   ['helper', './utils/helper'],
      //   ['material-ui/DatePicker', '../custom/DatePicker'],
      //   ['material-ui', 'material-ui-ie10'],
      // ],
    },
    'import/extensions': [
      '.ts',
      '.tsx',
      '.d.ts',
      '.js',
      '.jsx',
      '.mdx',
      '.json',
    ],
    'import/core-modules': ['electron', 'atom'],
  },
  extends: [
    'eslint:recommended',
    'xo',
    'xo-react',
    'airbnb',
    'airbnb/hooks',
    'plugin:eslint-comments/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'plugin:prettier/recommended',
    'prettier/react',
    'prettier/unicorn',
  ],
  plugins: [
    'no-use-extend-native',
    'unicorn',
    'promise',
    'markdown',
    'import',
    'node',
    'eslint-comments',
  ],
  rules: {
    ...additionalChanges,
    ...unicornRules,
    ...promiseRules,
    ...importRules,
    ...nodeRules,
    ...eslintCommentsRules,
  },
};
