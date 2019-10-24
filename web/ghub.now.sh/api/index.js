/* eslint-disable promise/prefer-await-to-then */

const url = require('url');
const path = require('path');
const parseGithub = require('parse-github-url');
const parsePkgName = require('parse-package-name');
const ky = require('ky-universal');

async function packageJson(packageName, endpoint) {
  const { name, version } = parsePkgName(packageName);
  const tag = version === '' ? 'latest' : version;
  const uri =
    typeof endpoint === 'function'
      ? endpoint(name, tag)
      : `https://unpkg.com/${name}@${tag}/package.json`;

  return ky
    .get(uri)
    .then((resp) => resp.text())
    .then(JSON.parse);
}

// ! we are doing this because `now dev` fails for some reason, so we are using `micro-dev`
function wrapper(fn) {
  return async function microHandler(req, res) {
    res.status =
      res.status ||
      ((code) => {
        res.statusCode = code;
      });

    res.send = (val, statusCode = 200) => {
      if (statusCode === 301 || statusCode === 302) {
        res.status(statusCode);
        res.setHeader('Location', val);
        res.end();
        return;
      }
      res.status(statusCode);

      if (val && typeof val === 'object') {
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify(val));
        return;
      }
      res.end(val);
    };

    const result = await fn(req, res);
    return result;
  };
}

module.exports = wrapper(handler);

// eslint-disable-next-line max-statements
async function handler(req, res) {
  const ALLOWED_HTTP_METHOD = 'GET';
  res.setHeader('Access-Control-Request-Method', ALLOWED_HTTP_METHOD);

  if (req.method !== ALLOWED_HTTP_METHOD) {
    res.send('Method Not Allowed', 405);
    return;
  }

  // eslint-disable-next-line node/prefer-global/url
  const parsed = new url.URL(`https://loc.com${req.url}`);

  if (!process.env.isMicro && /^\/(?:api)?\/?$/.test(parsed.pathname)) {
    res.send('/', 302);
    return;
  }

  const parts = clean(parsed.pathname).split('/');

  /**
   * Scoped:
   * /@tunnckocore/execa
   * /@tunnckocore/execa@5.0.2
   * /@tunnckocore/execa@5.0.2/v6-parse-function - version/tag takes precedence
   * /@tunnckocore/execa/v6-parse-function
   *
   * Non-scoped:
   * /stringify-github-short-url
   * /stringify-github-short-url@3.1.2
   * /stringify-github-short-url@3.1.2/v6-parse-function - version/tag takes precedence
   * /stringify-github-short-url/v6-parse-function
   *
   */

  const name = parts.length >= 2 ? parts.slice(0, 2).join('/') : parts[0];
  const ats = name.split('@');

  const isScoped = ats[0] === '';
  const version = ats.length > 1 ? (isScoped ? ats[2] : ats[1]) : null;

  let pkg = null;
  try {
    pkg = await packageJson(name);
  } catch (err) {
    console.error(err);
    res.send(`Package not found or loading error ${name}`, 404);
    return;
  }

  const repoBranch = isScoped ? parts.slice(2) : parts.slice(1);
  const repository = (pkg.repository && pkg.repository.url) || pkg.repository;
  const directory = (pkg.repository && pkg.repository.directory) || '';
  const repoBr = repoBranch.length > 0 ? repoBranch : ['master'];

  const branch = version ? name : path.join(...repoBr);

  const dir = directory ? `/tree/${branch}/${clean(directory)}` : '';

  const pkgUrl = clean(repository.replace('.git', ''));

  if (pkgUrl) {
    const gh = parseGithub(`${pkgUrl}${dir}`);

    if (dir) {
      // res.send(`A: https://${gh.host}/${gh.repo}${dir}`);
      res.send(`https://${gh.host}/${gh.repo}${dir}`, 302);
      return;
    }

    const fp = gh.pathname.replace('.git', '');
    // res.send(`B: https://${gh.host}/${fp}`);
    res.send(`https://${gh.host}/${fp}`, 302);
    return;
  }
  if (isString(pkg.homepage)) {
    // res.send(`C: ${pkg.homepage}`);
    res.send(pkg.homepage, 302);
    return;
  }

  // res.send(`D: https://npmjs.com/package/${name}`);
  res.send(`https://npmjs.com/package/${name}`, 302);
}

function isString(val) {
  return val && typeof val === 'string';
}

function clean(val) {
  return isString(val) ? val.replace(/^\/|\/$/, '') : val;
}
