'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var proc = _interopDefault(require('process'));

// import { fileURLToPath } from 'url';
// const PKG_ROOT = fileURLToPath(path.dirname(path.dirname(import.meta.url)));

const build = (scripts, args) => {
  const [pkgRoot = proc.cwd()] = args;
  return pkgRoot || args.includes('--force') ? `yarn scripts pika-pack build --emoji --cwd "${pkgRoot}"` : 'echo "Skipping..."';
};
const help = 'echo "TODO: help"';
function build2(scripts, args) {
  const serial = args.includes('--serial') ? '--concurency 1' : '';
  return `lerna exec ${serial} 'yarn start build \\"$PWD\\"\'`; // return 'yarn workspaces run start build';
}
function ver(scripts, args) {
  const defaultArgs = ['--no-push', '--sign-git-commit', '--sign-git-tag', '--conventional-commits'].concat(args);
  const {
    sub,
    flags
  } = subCommandHelper(defaultArgs);
  return `yarn scripts lerna version ${sub} ${flags.join(' ')}`;
}
function pub(scripts, args) {
  const {
    sub,
    flags
  } = subCommandHelper([].concat(args));
  return `yarn scripts lerna publish ${sub} ${flags}`;
}

function subCommandHelper(args) {
  const flags = args.filter(Boolean).filter(x => x.startsWith('-'));
  const [sub] = args.filter(x => !x.startsWith('-')).filter(Boolean);

  if (!sub) {
    throw new Error('requires patch|minor|major|from-package|from-git ');
  }

  return {
    flags,
    sub
  };
}

function mk(scripts, [name, dest]) {
  return [`yarn scripts charlike -t ./pkg-template --name ${name} --desc wipwipwip --dest ${dest}`];
}

exports.build = build;
exports.build2 = build2;
exports.help = help;
exports.mk = mk;
exports.pub = pub;
exports.ver = ver;
