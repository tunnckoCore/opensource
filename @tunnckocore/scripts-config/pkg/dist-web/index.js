// import path from 'path';
// import { fileURLToPath } from 'url';
// const PKG_ROOT = fileURLToPath(path.dirname(path.dirname(import.meta.url)));
const build = (scripts, args) => {
  const [pkgRoot] = args;
  return pkgRoot ? "yarn scripts pika-pack build --emoji --cwd \"".concat(pkgRoot, "\"") : 'echo "Skipping..."';
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
  return "yarn scripts lerna version ".concat(sub, " ").concat(flags.join(' '));
}
function pub(scripts, args) {
  const {
    sub,
    flags
  } = subCommandHelper([].concat(args));
  return "yarn scripts lerna publish ".concat(sub, " ").concat(flags);
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

export { ball, build, build2, cfg, help, pub, ver };
