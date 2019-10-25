const url = require('url');
const pLocate = require('p-locate');
const ky = require('ky-universal');

const { zeitLambdaWrapper, ORIGIN } = require('../utils');

const JSDELIVR = 'https://cdn.jsdelivr.net/gh/tunnckoCore/opensource';

module.exports = zeitLambdaWrapper(handler);

// eslint-disable-next-line max-statements
async function handler(req, res) {
  // eslint-disable-next-line node/prefer-global/url
  const parsed = new url.URL(`${ORIGIN}${req.url}`);

  if (/^\/(?:api)?\/?$/.test(parsed.pathname)) {
    res.send('/', 302);
    return;
  }

  const field = parsed.searchParams.get('field');
  const name = parsed.pathname.replace(/^\/(?:api\/)?/, '');

  const isScoped = name.includes('/') && name.startsWith('@');
  const [, pkgName, ver = 'master'] = isScoped
    ? name.split('@')
    : ['', ...name.split('@').filter(Boolean)];
  const [version = 'master', ...restPath] = ver.split('/');
  const encodedName = `${isScoped ? '@' : ''}${pkgName}@${version}`.replace(
    /@/g,
    '%40',
  );

  const rawName = isScoped ? pkgName.replace(/^tunnckocore\//, '') : pkgName;
  let pkgLoc = isScoped ? `@${pkgName}` : `packages/${pkgName}`;

  const loc = /preset|config/.test(pkgName) ? `configs/${rawName}` : pkgLoc;

  pkgLoc = `${loc}${restPath.length > 0 ? `/${restPath.join('/')}` : ''}`;

  const pathname =
    version === 'master' ? `@master/${pkgLoc}` : `@${encodedName}/${pkgLoc}`;

  // try request `src/index.ts`, `src/index.js`, `index.ts`, `index.js`
  if (!/\.(jsx?|tsx?)$/.test(pathname)) {
    if (field) {
      const resp = await ky
        .get(`${JSDELIVR}${pathname}/package.json`)
        .then((x) => x.text())
        .catch(() => {});

      // if `package.json` is found, try getting the source of file given `field`
      // which field by default is the "module" one.
      // Pass `field=main` query param to get the main field.
      if (resp) {
        let srcPath = null;
        try {
          srcPath = JSON.parse(resp)[field];
        } catch (err) {
          res.send('Found `package.json` but failed to parse.', 500);
          return;
        }

        await ky
          .get(`${JSDELIVR}${pathname}/${srcPath}`)
          .then(() => {
            res.send(`${JSDELIVR}${pathname}/${srcPath}`, 301);
          })
          .catch(() => {
            res.send(
              `Not found source path given in the "${field}" of package.json`,
              404,
            );
          });
        return;
      }
    }

    const result = await pLocate(
      ['src/index.ts', 'src/index.js', 'index.ts', 'index.js'].map((fp) =>
        ky
          .get(`${JSDELIVR}${pathname}/${fp}`)
          .then(async (x) => ({ file: fp, value: await x.text() }))
          .catch(() => {}),
      ),
      (val) => {
        if (typeof val === 'undefined') {
          return false;
        }
        return true;
      },
    );

    if (result) {
      console.log('found', `${JSDELIVR}${pathname}/${result.file}`);
      res.send(`${JSDELIVR}${pathname}/${result.file}`, 301);
      return;
    }
    console.log('not found', `${JSDELIVR}${pathname}`);
    res.send(`File path not found: ${pathname}`, 404);
    return;
  }

  res.send(`${JSDELIVR}${pathname}`, 301);
}
