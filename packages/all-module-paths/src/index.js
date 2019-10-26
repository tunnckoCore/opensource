import fs from 'fs';
import os from 'os';
import path from 'path';
import mod from 'module';
import assert from 'assert';
import dirs from 'global-dirs';

const HOMEDIR = os.homedir();

export default function allModulePaths(options = {}) {
  const { paths } = { paths: [], ...options };

  assert(Array.isArray(paths), 'expect options.paths to be string[]');

  const pnpmStoreVersions = ['3', '2', '1'].map((x) =>
    path.join('pnpm-global', String(x), 'node_modules'),
  );

  /**
   * GLOBAL
   */

  // Maximum up to the home directory
  const globalPaths = mod.globalPaths
    .filter((x) => x.startsWith(HOMEDIR))

    // ?? removing pnpm stuff from globalPaths, we later adding it again
    .filter((x) => {
      const condition = pnpmStoreVersions.find(
        (fp) => (x.includes(fp) && x.endsWith(fp)) || !x.includes(fp),
      );

      return condition;
    })
    .filter((x) => !x.includes(path.join('pnpm-global', 'node_modules')));

  // Note: Be careful, if node changes the positions order
  // Basically the last element of the globalPaths array
  // is always the `~/.nvm/versions/node/v10.13.0/lib/node_modules`
  // or, strangely, `~/.nvm/versions/node/v10.13.0/lib/node`
  const nvmModules = globalPaths[globalPaths.length - 1];

  // So we dirname two times and then join "pnpm-global/1/node_modules"
  const nvmCurrent = path.dirname(path.dirname(nvmModules));

  // Intentionally getting the NVM_DIR that way,
  // Take care! Might not be cross-platform and
  // probably better way is to be reading the env.
  const nvmDir = path.dirname(path.dirname(path.dirname(nvmCurrent)));

  // Another note is that this node_modules directory don't have `.bin` dir
  // inside of it, similar to the NVM's `vX.X.X/lib/node_modules` one.
  // PNPM uses the default Npm/NVM global bin directory and
  // as far as I know, it cannot be changed.
  // Only the pnpm-store path can be changed.
  const pnpmGlobal = pnpmStoreVersions.find((pnpmGlobalStore) =>
    fs.existsSync(pnpmGlobalStore),
  );

  // Always first all the "official" global paths,
  // it's mostly always a short array of few items paths.
  // That ensures that the nvm's global dir is always last item
  // We also filtering out the `vX.X.X/node_modules`, because such never exist.
  const globalPackages = globalPaths
    .filter((x) => !x.endsWith(path.join(nvmCurrent, 'node_modules')))
    .filter((x) => {
      if (!x.startsWith(nvmDir)) {
        return true;
      }
      const start = x.startsWith(nvmDir);
      return (
        (start && x.endsWith(pnpmGlobal)) ||
        x.includes(path.join(nvmCurrent, 'lib'))
      );
    })
    .slice(0, -1)
    .concat(
      Object.keys(dirs).reduce(
        (acc, manager) => acc.concat(dirs[manager].packages),
        [],
      ),
    );

  const globalBinaries = globalPackages
    .map((x) => {
      // Exclude from joining/appending `.bin`, because it uses
      // the npm's global bin which we already have and handle.
      if (x.includes('pnpm-global')) {
        return null;
      }

      // tweak the NVM dirs,
      // We should not append `.bin` to the `./node/vX.X.X/lib/node_modules`
      // but instead the bins are in the `./node/vX.X.X/bin`
      const start = path.join(HOMEDIR, '.nvm', 'versions', 'node');
      const end = path.join('lib', 'node_modules');

      if (x.startsWith(start) && x.endsWith(end)) {
        // So we up until `./node/vX.X.X` and join bin
        return path.join(path.dirname(path.dirname(x)), 'bin');
      }
      return path.join(x, '.bin');
    })
    .filter(Boolean);

  const globalModules = {
    packages: globalPackages,
    binaries: globalBinaries,
  };

  /**
   * LOCAL
   */

  const localPackages = paths.filter((x) => x.startsWith(HOMEDIR));
  const localBinaries = localPackages.map((x) => path.join(x, '.bin'));

  const localModules = {
    packages: localPackages,
    binaries: localBinaries,
  };

  /**
   * ALL
   */

  const allPaths = {
    packages: localPackages.concat(globalPackages),
    binaries: localBinaries.concat(globalBinaries),
  };

  return { globalModules, localModules, allPaths };
}
