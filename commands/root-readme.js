'use strict';

/* eslint-disable global-require, import/no-dynamic-require */

const fs = require('fs');
const util = require('util');
const path = require('path');
const crypto = require('crypto');
const { getWorkspacesAndExtensions } = require('@tunnckocore/utils');

const { workspaces } = getWorkspacesAndExtensions(path.dirname(__dirname));

function toHash(input) {
  return crypto.createHash('md5').update(input).digest('hex').slice(0, 10);
}

module.exports = require('@hela/core')()
  .command(
    'gen:readme',
    'Generate monorepo root readme with useful info about each package',
  )
  .example('readme > README.md')
  .example('gen:readme > README.md')
  .alias(['r', 'root-readme', 'genreadme', 'readme'])
  .action(function main() {
    const contents = [
      '# Open Source Monorepo',
      '',
      require('../package.json').description,
      '',
      '## Workspaces',
      '',
    ];

    const wsMap = {
      '@packages': { desc: 'Non-scoped general purpose packages' },
      '@tunnckocore': { desc: 'Scoped general purpose packages' },
      // '@hela': {
      //   link: '@hela',
      //   desc: 'Powerful software development',
      // },
    };

    contents.push('<!-- prettier-ignore-start -->');
    contents.push('');

    const list = workspaces
      .filter((x) => !/@configs/.test(x))
      .reduce((acc, wsName) => {
        const { link, desc } = wsMap[wsName];
        const wsDir = path.join(path.dirname(__dirname), wsName);

        contents.push(
          util.format(
            '### %s',
            link ? `[${wsName}](./tree/master/${wsName})` : wsName,
          ),
        );
        contents.push('');
        contents.push(`> ${desc}`);
        contents.push('');
        contents.push('| pkg | badges |');
        contents.push('| :--- | :---: |');

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

            contents.push(`| ${pkgLoc} | ${npmBadge} ${covBadge} |`);

            return { name, hash, covBadgeLink };
          });

        contents.push('');

        return acc.concat(pkgs);
      }, []);

    list.forEach(({ name, hash, covBadgeLink }) => {
      contents.push(
        `
[npm-${hash}-url]: https://www.npmjs.com/package/${name}
[npm-${hash}-img]: https://badgen.net/npm/v/${name}?icon=npm
[cov-${hash}-url]: https://www.npmjs.com/package/${name}
[cov-${hash}-img]: ${covBadgeLink}
        `.trim(),
      );
    });

    contents.push('');
    contents.push('<!-- prettier-ignore-end -->');

    fs.writeFileSync(
      path.join(process.cwd(), 'README.md'),
      contents.join('\n'),
    );

    console.log('Done.');
  });
