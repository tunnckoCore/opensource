/* eslint-disable prefer-destructuring, no-param-reassign, max-params */

/**
 * Generate github / npm shorthand from list
 * of arguments or object.
 *
 * @example
 * import stringify from 'stringify-github-short-url';
 *
 * stringify('jonschlinkert', 'micromatch');          // => 'jonschlinkert/micromatch'
 * stringify('jonschlinkert', 'micromatch', 'dev');   // => 'jonschlinkert/micromatch#dev'
 * stringify('gulpjs', 'gulp', 'v3.8.1', true);       // => 'gulpjs/gulp@v3.8.1'
 * stringify({
 *   owner: 'tunnckoCore',
 *   name: 'parse-function'
 * }); // => 'tunnckoCore/parse-function'
 * stringify({
 *   user: 'assemble',
 *   repo: 'assemble-core'
 * }); // => 'assemble/assemble-core'
 *
 * @name  stringifyGithubShortUrl
 * @param  {string|object} `<owner>` user or org string, or object
 * @param  {string} `[name]` repo name
 * @param  {string} `[branch]` branch name
 * @param  {string} `[npm]` pass `true` if you want to generate npm shorthand
 * @return {string} generated shorthand
 * @public
 */
export default function stringifyGithubShortUrl(owner, name, branch, npm) {
  if (owner && typeof owner === 'object') {
    const params = owner;
    owner = params.owner || params.user;
    name = params.name || params.repo;
    branch = params.branch;
    npm = params.npm;
  }

  if (typeof owner !== 'string') {
    throw new TypeError(
      'stringify-github-short-url: expects `owner` to be a string',
    );
  }
  if (typeof name !== 'string') {
    return owner;
  }

  const url = `${owner}/${name}`;
  if (typeof branch === 'string' && branch.length > 0) {
    return url + (npm === true ? '@' : '#') + branch;
  }
  return url;
}
