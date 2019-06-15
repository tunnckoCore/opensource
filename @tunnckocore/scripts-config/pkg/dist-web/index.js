import proc from 'process';

// import { fileURLToPath } from 'url';
// const PKG_ROOT = fileURLToPath(path.dirname(path.dirname(import.meta.url)));

const build = (scripts, args) => {
  const [pkgRoot = proc.cwd()] = args;
  return pkgRoot || args.includes('--force') ? "yarn scripts pika-pack build --emoji --cwd \"".concat(pkgRoot, "\"") : 'echo "Skipping..."';
};
const help = 'echo "TODO: help"';
function build2(scripts, args) {
  const serial = args.includes('--serial') ? '--concurency 1' : '';
  return "lerna exec ".concat(serial, " 'yarn start build \\\"$PWD\\\"'"); // return 'yarn workspaces run start build';
}
function ver(scripts, args) {
  const defaultArgs = ['--no-push', '--sign-git-commit', '--sign-git-tag', '--conventional-commits'].concat(args);
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

function mk(scripts, _ref) {
  let [name, dest] = _ref;
  return ["yarn scripts charlike -t ./pkg-template --name ".concat(name, " --desc wipwipwip --dest ").concat(dest)];
}

export { build, build2, help, mk, pub, ver };
