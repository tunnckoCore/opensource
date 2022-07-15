// SPDX-License-Identifier: Apache-2.0

/* eslint-disable unicorn/prefer-module */

module.exports = {
  endOfLine: 'lf',

  printWidth: 80,

  // AirBnB Style forces using spaces, a tab is 2-space.
  // Here we force using tabs, 2-space tab.
  // More here: https://lea.verou.me/2012/01/why-tabs-are-clearly-superior/
  // and NEVER USE: https://dev.to/christoslitras/never-use-tabs-for-code-indentation-3ln2
  tabWidth: 2,
  useTabs: false,

  // That actually is enforced by AirBnB Style anyway.
  // Explicitness is the most important thing:
  // - Always is visible that this is function (because the parens).
  // - If you first write single param and decide to add new one,
  // then you should also add a parens around the both - that's mess.
  arrowParens: 'always',

  // Enforce single-quotes, because industry standard.
  singleQuote: true,

  // That actually is enforced by AirBnB Style anyway.
  // Always useful. And guaranteed that you won't see boring errors,
  // that eats your time, because of nothing real.
  trailingComma: 'all',

  // That actually is enforced by AirBnB Style anyway.
  // Enforce more clear object literals.
  // As seen in this example https://github.com/airbnb/javascript#objects--rest-spread
  bracketSpacing: true,

  // That actually is enforced by AirBnB Style anyway.
  // Enforcing bracket on the next line makes differentiate
  // where ends the tag and its properties and where starts the content of the tag.
  // https://prettier.io/docs/en/options.html#jsx-brackets
  bracketSameLine: false,
};
