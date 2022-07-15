// SPDX-License-Identifier: ISC

// `semver` contributors, ISC
// June 27, commit c56a701f456539
// https://github.com/npm/node-semver/blob/c56a701f456539/internal/re.js
// stripped only to have the needed for `.inc`
// at the end of the file are the ESM exports

// The actual regexps go on exports.re
const re = [];
const src = [];
const t = {};
let R = 0;

const createToken = (name, value, isGlobal) => {
  // eslint-disable-next-line no-plusplus
  const index = R++;
  t[name] = index;
  src[index] = value;
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined);
};

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*');
createToken('NUMERICIDENTIFIERLOOSE', '[0-9]+');

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', '\\d*[a-zA-Z-][a-zA-Z0-9-]*');

// ## Main Version
// Three dot-separated numeric identifiers.

createToken(
  'MAINVERSION',
  `(${src[t.NUMERICIDENTIFIER]})\\.` +
    `(${src[t.NUMERICIDENTIFIER]})\\.` +
    `(${src[t.NUMERICIDENTIFIER]})`,
);

createToken(
  'MAINVERSIONLOOSE',
  `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
    `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
    `(${src[t.NUMERICIDENTIFIERLOOSE]})`,
);

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

createToken(
  'PRERELEASEIDENTIFIER',
  `(?:${src[t.NUMERICIDENTIFIER]}|${src[t.NONNUMERICIDENTIFIER]})`,
);

createToken(
  'PRERELEASEIDENTIFIERLOOSE',
  `(?:${src[t.NUMERICIDENTIFIERLOOSE]}|${src[t.NONNUMERICIDENTIFIER]})`,
);

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken(
  'PRERELEASE',
  `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`,
);

createToken(
  'PRERELEASELOOSE',
  `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${
    src[t.PRERELEASEIDENTIFIERLOOSE]
  })*))`,
);

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', '[0-9A-Za-z-]+');

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken(
  'BUILD',
  `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`,
);

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken(
  'FULLPLAIN',
  `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`,
);

createToken('FULL', `^${src[t.FULLPLAIN]}$`);

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken(
  'LOOSEPLAIN',
  `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${
    src[t.BUILD]
  }?`,
);

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`);

export { re, t, src };
