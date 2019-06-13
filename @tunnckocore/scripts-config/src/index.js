// import path from 'path';
// import { fileURLToPath } from 'url';

// const PKG_ROOT = fileURLToPath(path.dirname(path.dirname(import.meta.url)));

export const build = (scripts, args) => {
  const [pkgRoot] = args;

  return pkgRoot
    ? `yarn scripts pika-pack build --emoji --cwd "${pkgRoot}"`
    : 'echo "Skipping..."';
};

export const help = 'echo "TODO: help"';
