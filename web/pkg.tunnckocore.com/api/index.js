const url = require('url');
const ky = require('ky-universal');
const pLocate = require('p-locate');

const api = 'https://cdn.jsdelivr.net/gh/tunnckoCore/opensource';

function redirect(res, location, statusCode = 301) {
  res.status(statusCode);
  res.setHeader('Location', location);
  res.end();
}

// eslint-disable-next-line max-statements
module.exports = async (req, res) => {
  const ALLOWED_HTTP_METHOD = 'GET';
  res.setHeader('Access-Control-Request-Method', ALLOWED_HTTP_METHOD);
  if (req.method !== ALLOWED_HTTP_METHOD) {
    res.status(405);
    res.send('Method Not Allowed');
    return;
  }
  // eslint-disable-next-line node/prefer-global/url
  const parsed = new url.URL(`https://loc.com${req.url}`);

  if (/^\/(?:api)?\/?$/.test(parsed.pathname)) {
    redirect(res, '/', 302);
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
        .get(`${api}${pathname}/package.json`)
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
          res.send(500).send('Found `package.json` but failed to parse.');
          return;
        }

        await ky
          .get(`${api}${pathname}/${srcPath}`)
          .then(() => {
            redirect(res, `${api}${pathname}/${srcPath}`, 302);
          })
          .catch(() => {
            res
              .status(404)
              .send(
                `Not found source path given in the "${field}" of package.json`,
              );
          });
        return;
      }
    }

    const result = await pLocate(
      ['src/index.ts', 'src/index.js', 'index.ts', 'index.js'].map((fp) =>
        ky
          .get(`${api}${pathname}/${fp}`)
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
      console.log('found', `${api}${pathname}/${result.file}`);
      // res.status(200).send(`${pathname}/${result.file}`);
      redirect(res, `${api}${pathname}/${result.file}`, 302);
      return;
    }
    console.log('not found', `${api}${pathname}`);
    res.setHeader('Content-Type', 'text/html');
    res.status(404).send(`<h1>File path not found: ${pathname}</h1>`);
    return;
  }

  // res.status(200).send(`${pathname}`);
  redirect(res, `${api}${pathname}`, 302);
};
