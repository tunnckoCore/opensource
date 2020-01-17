#!/usr/bin/env node

'use strict';

/* eslint-disable global-require, import/no-dynamic-require */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { getWorkspacesAndExtensions } = require('@tunnckocore/utils');

const { workspaces } = getWorkspacesAndExtensions(path.dirname(__dirname));

function toHash(input) {
  return crypto
    .createHash('md5')
    .update(input)
    .digest('hex')
    .slice(0, 10);
}

module.exports = function main() {
  console.log('# Open Source Monorepo');
  console.log('');

  console.log(require('../package.json').description);

  console.log('## Workspaces');
  console.log('');

  const wsMap = {
    packages: { desc: 'Non-scoped general purpose packages' },
    '@tunnckocore': { desc: 'Scoped general purpose packages' },
    // '@hela': {
    //   link: '@hela',
    //   desc: 'Powerful software development',
    // },
  };

  const list = workspaces
    .filter((x) => !/configs/.test(x))
    .reduce((acc, wsName) => {
      const { link, desc } = wsMap[wsName];
      const wsDir = path.join(path.dirname(__dirname), wsName);

      console.log(
        '### %s',
        link ? `[${wsName}](./tree/master/${wsName})` : wsName,
      );
      console.log('');
      console.log('>  %s', desc);
      console.log('');
      console.log('| pkg | badges |');
      console.log('| :--- | :---: |');

      const pkgs = fs
        .readdirSync(wsDir)
        .map((pkgDirName) => path.join(wsDir, pkgDirName))
        .filter((fp) => fs.statSync(fp).isDirectory())
        .map((fp) => {
          const { name, cov } = require(path.join(fp, 'package.json'));
          const hash = toHash(name, 'utf8');

          const pkgLoc = `[\`${name}\`](https://ghub.now.sh/${name})`;
          const covBadgeLink = cov.value
            ? `https://badgen.net/badge/coverage/${cov.value}%25/${cov.color}?icon=codecov`
            : 'https://badgen.net/badge/coverage/unknown/grey?icon=codecov';

          const npmBadge = `[![npm][npm-${hash}-img]][npm-${hash}-url]`;
          const covBadge = `[![cov][cov-${hash}-img]][cov-${hash}-url]`;

          console.log('| %s | %s %s |', pkgLoc, npmBadge, covBadge);

          return { name, hash, covBadgeLink };
        });

      console.log('');

      return acc.concat(pkgs);
    }, []);

  list.forEach(({ name, hash, covBadgeLink }) => {
    console.log(`[npm-${hash}-url]: https://www.npmjs.com/package/${name}
  [npm-${hash}-img]: https://badgen.net/npm/v/${name}?icon=npm
  [cov-${hash}-url]: https://www.npmjs.com/package/${name}
  [cov-${hash}-img]: ${covBadgeLink}`);
  });
};
