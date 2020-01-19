/* eslint-disable max-params */
import parse from 'parse-github-url';
import stringify from 'stringify-github-short-url';

/**
 * Creates consistent parsed object from string
 * pattern or from listed arguments. If `owner` is object,
 * it can accepts `user` and `repo` properties. Treats that
 * `owner` argument as owner if `name` is string (which is the `repo`)
 * from the `user/repo` pattern.
 *
 * @example
 * import gitcloneDefaults from 'gitclone-defaults';
 *
 * gitcloneDefaults({
 *   user: 'foo',
 *   repo: 'bar',
 *   branch: 'zeta'
 * }, true);
 * gitcloneDefaults({
 *   user: 'foo',
 *   repo: 'bar',
 *   branch: 'dev2'
 * });
 * gitcloneDefaults({
 *   owner: 'foo',
 *   name: 'bar',
 * }, { dest: 'beta', ssh: true });
 * gitcloneDefaults({
 *   owner: 'foo',
 *   name: 'bar',
 * }, { dest: 'beta' }, true);
 * gitcloneDefaults('foo/bar');
 * gitcloneDefaults('foo', 'bar');
 * gitcloneDefaults('foo', 'bar', 'dev3');
 * gitcloneDefaults('foo', 'bar', 'dev3', { dest: 'dest3' });
 * gitcloneDefaults('foo/bar', { ssh: true });
 * gitcloneDefaults('foo/bar', { branch: 'opts' });
 * gitcloneDefaults('foo/bar', { branch: 'opts' }, { ssh: true });
 * gitcloneDefaults('foo/bar', { branch: 'opts' }, true);
 * gitcloneDefaults('foo', 'bar', 'baz', true);
 * gitcloneDefaults('foo/bar', { branch: 'qux' }, true);
 * gitcloneDefaults('foo/bar#dev', { ssh: true });
 * gitcloneDefaults('foo/bar#qux', true);
 * gitcloneDefaults('foo/bar#qux', true, { dest: 'ok' });
 *
 * @param  {string|object} `owner` the `user/repo` pattern or anything
 *                                 that [parse-github-url][] can parse
 * @param  {string|boolean|object} `name` if boolean treats it as `ssh`
 * @param  {string|boolean|object} `branch` if boolean treats it as `ssh`
 * @param  {boolean|object} `ssh` useful in higher-level libs, and if it
 *                                is `object` it can contains `ssh`
 *                                and `dest` properties`
 * @return {object} result object contains anything that [parse-github-url][]
 *                  contains and in addition has `ssh` and `dest` properties
 * @public
 */
export default function gitcloneDefaults(owner, name, branch, ssh) {
  let res = null;
  if (typeof owner === 'string' && arguments.length === 1) {
    res = parse(owner);
  } else {
    res = parse(stringify(owner, name, branch));
  }

  res.ssh = (owner && owner.ssh) || (name && name.ssh) || false;
  res.ssh = res.ssh || (typeof name === 'boolean' && name) || false;
  res.ssh = res.ssh || (typeof branch === 'boolean' && branch) || false;
  res.ssh = res.ssh || (typeof ssh === 'boolean' && ssh) || false;
  res.ssh = res.ssh || (branch && branch.ssh) || false;
  res.branch = (name && name.branch) || (branch && branch.branch) || res.branch;
  res.branch = typeof res.branch === 'string' && res.branch;
  res.dest = (owner && owner.dest) || (name && name.dest) || false;
  res.dest = res.dest || (branch && branch.dest) || false;
  res.dest = res.dest || (ssh && ssh.dest) || false;
  res.dest = (typeof res.dest === 'string' && res.dest) || false;
  return res;
}
