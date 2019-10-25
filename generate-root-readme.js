/* eslint-disable global-require, import/no-dynamic-require */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { getWorkspacesAndExtensions } = require('@tunnckocore/utils');

const { workspaces } = getWorkspacesAndExtensions(__dirname);

function toHash(input) {
  return crypto
    .createHash('md5')
    .update(input)
    .digest('hex')
    .slice(0, 10);
}

// | Topic                                                            |                                           Contact |
// | :--------------------------------------------------------------- | ------------------------------------------------: |
// | Any legal or licensing questions, like private or commerical use |           ![tunnckocore_legal][tunnckocore_legal] |
// | For any critical problems and security reports                   |     ![tunnckocore_security][tunnckocore_security] |
// | Consulting, professional support, personal or team training      | ![tunnckocore_consulting][tunnckocore_consulting] |
// | For any questions about Open Source, partnerships and sponsoring | ![tunnckocore_opensource][tunnckocore_opensource] |

console.log('# Open Source Monorepo');
console.log('');
console.log('## Workspaces');
console.log('');

const wsMap = {
  packages: { desc: 'Non-scoped general purpose packages' },
  '@tunnckocore': { desc: 'Scoped general purpose packages' },
  '@hela': {
    link: '@hela',
    desc: 'Powerful software development',
  },
};

const list = workspaces
  .filter((x) => !/configs/.test(x))
  .reduce((acc, wsName) => {
    const { link, desc } = wsMap[wsName];
    const wsDir = path.join(__dirname, wsName);

    console.log(
      '### %s',
      link ? `[${wsName}](/tree/master/${wsName})` : wsName,
    );
    console.log('>  %s', desc);
    console.log('');
    console.log('| pkg | badges |');
    console.log('| :--- | :---: |');

    const pkgs = fs
      .readdirSync(wsDir)
      .map((pkgDirName) => path.join(wsDir, pkgDirName))
      .filter((fp) => fs.statSync(fp).isDirectory())
      .map((fp) => {
        const { name, jestCov } = require(path.join(fp, 'package.json'));
        const hash = toHash(name, 'utf8');
        const pkgLoc = `[\`${name}\`](/tree/master/${wsName}/${name})`;
        const covBadgeLink = jestCov.value
          ? `https://badgen.net/badge/coverage/${jestCov.value}%25/${jestCov.color}?icon=codecov`
          : 'https://badgen.net/badge/coverage/unknown/grey?icon=codecov';

        // [![npm version][npmv-img]][npmv-url]
        const npmBadge = `[![npm][npm-${hash}-img]][npm-${hash}-url]`;
        const covBadge = `[![cov][cov-${hash}-img]][cov-${hash}-url]`;

        console.log('| %s | %s %s |', pkgLoc, npmBadge, covBadge);

        return { name, hash, covBadgeLink };
      });

    console.log('');

    return acc.concat(pkgs);
    // console.log(pkgs);
  }, []);

list.forEach(({ name, hash, covBadgeLink }) => {
  console.log(`
[npm-${hash}-url]: https://www.npmjs.com/package/${name}
[npm-${hash}-img]: https://badgen.net/npm/v/${name}?icon=npm
[cov-${hash}-url]: https://www.npmjs.com/package/${name}
[cov-${hash}-img]: ${covBadgeLink}
`);
});
