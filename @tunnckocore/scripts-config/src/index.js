import proc from 'process';
import path from 'path';

// import path from 'path';
// import { fileURLToPath } from 'url';

// const PKG_ROOT = fileURLToPath(path.dirname(path.dirname(import.meta.url)));

// const prebuild = `cd ${PKG_ROOT}`;
// const postbuild = `cd $PWD`;

export const build = (scripts, args) => {
  const [pkgRoot] = args;
  console.log('pkgRoot:::::::::::::::::::::', pkgRoot);

  if (pkgRoot && path.basename(pkgRoot) !== 'config') {
    console.log('foooo', path.basename(pkgRoot));
    return `yarn scripts pika-pack build --emoji --cwd "${pkgRoot}"`;
  }
  if (pkgRoot && proc.env.NODE_ENV === 'configSelf') {
    return `yarn scripts pika-pack build --emoji --cwd "${pkgRoot}"`;
  }
  return 'echo "Skipping..."';
};

export const help = 'echo "TODO: help"';
