import parsePkgName from 'parse-package-name';
import ky from 'ky-universal';

export const ORIGIN =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://ghub.now.sh';

export function zeitLambdaWrapper(fn, allowedMethods = ['GET']) {
  return async function lambdaHandler(req, res) {
    res.setHeader('Origin', ORIGIN);
    res.setHeader('Access-Control-Allow-Origin', ORIGIN);
    res.setHeader(
      'Access-Control-Allow-Methods',
      allowedMethods.map((x) => x.toUpperCase()).join(', '),
    );
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

    if (!allowedMethods.includes(req.method)) {
      res.send('Method Not Allowed', 405);
      return;
    }

    // 604800 (7 days)
    res.setHeader(
      'Cache-Control',
      'public, max-age=0, s-maxage=604800, stale-while-revalidate=86400',
    );

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

    await fn(req, res);
  };
}

export async function packageJson(packageName, endpoint) {
  const { name, version } = parsePkgName(packageName);
  const tag = version === '' ? 'latest' : version;
  const uri =
    typeof endpoint === 'function'
      ? endpoint(name, tag)
      : `https://cdn.jsdelivr.net/npm/${name}@${tag}/package.json`;

  let pkg = null;
  try {
    pkg = await ky
      .get(uri)
      .then((resp) => resp.text())
      .then(JSON.parse);
  } catch (err) {
    // ! jsDelivr can response with 403 Forbidden, if over 50MB
    if (err.response && err.response.status === 403) {
      try {
        // ! so, try through UNPKG.com
        pkg = await packageJson(
          packageName,
          (x, t) => `https://unpkg.com/${x}@${t}/package.json`,
        );
      } catch (error) {
        throw new ky.HTTPError(
          `Package "${name}" not found, even through UNPKG.com!`,
        );
      }
      return pkg;
    }
    throw new ky.HTTPError(`Package "${name}" not found or loading error!`);
  }
  return pkg;
}

export function isString(val) {
  return val && typeof val === 'string';
}

export function cleanSlashes(val) {
  return isString(val) ? val.replace(/^\/|\/$/, '') : val;
}
