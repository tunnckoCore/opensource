'use strict';

module.exports = {
  printWidth: 80,

  // That actually is enforced by AirBnB Style anyway.
  // Enforce 2 spaces, because JavaScript is always different
  // then the rest of the languages.
  tabWidth: 2,

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
  jsxBracketSameLine: false,
};
