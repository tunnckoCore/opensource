'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// import path from 'path';
// import { fileURLToPath } from 'url';
// const PKG_ROOT = fileURLToPath(path.dirname(path.dirname(import.meta.url)));
const build = (scripts, args) => {
  const [pkgRoot] = args;
  return pkgRoot ? `yarn scripts pika-pack build --emoji --cwd "${pkgRoot}"` : 'echo "Skipping..."';
};
const help = 'echo "TODO: help"';
function cfg() {
  return "lerna exec 'yarn start build \\\"$PWD\\\"' --scope='@tunnckocore/scripts-config'";
}
function build2() {
  return "lerna exec 'yarn start build \\\"$PWD\\\"' --ignore='@tunnckocore/scripts-config'";
}
const ball = [cfg, build2];
function ver(scripts, args) {
  const defaultArgs = ['--sign-git-commit', '--sign-git-tag', '--conventional-commits'].concat(args);
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

exports.ball = ball;
exports.build = build;
exports.build2 = build2;
exports.cfg = cfg;
exports.help = help;
exports.pub = pub;
exports.ver = ver;
