/* eslint-disable unicorn/no-empty-file */
// // const mappings = new Map();

// /**
//  * 1. git remote add <project-name> <project-repo>
//  * 2. git fetch <project-name>
//  * 3. git checkout -b <project-name> <project-name/master>
//  * 4. make a folder move all files to that subfolder, so no merge conflicts
//  *   - use something like  `mv $(command ls -A) subfolder`
//  *   - it includes all files and folders, including the dot ones
//  *   - ignore the warning it cannot move subfolder into itself, it's OK
//  * 5. git commit -m "chore: move <project-name> into the monorepo"
//  *
//  * Follow the following, OR create a PR
//  *
//  * 6. git checkout master
//  * 7. git merge <project-name>
//  * 8. git push
//  * 9. cleanup
//  *   - git remote rm <project-name>
//  *   - git branch -d <project-name>
//  */

// const tckPackages = `
//   error-format
//   useful-error
//   kind-error
//   kind-of-extra
//   kind-of-types
//   is-kindof
//   assert-kindof
//   abbrev-kindof
//   always-done
//   try-catch-core
//   try-catch-callback
//   parse-function
//   arr-includes
//   ip-filter
//   glob-cache
//   koa-better-body
//   koa-better-router
//   parse-commit-message
//   gitclone-defaults
//   to-file-path
//   stringify-github-short-url
//   parse-github-short-url
//   npm-related
//   j140
//   online-branch-exist
//   function-arguments
//   manage-arguments
//   flatten-arguments
//   common-callback-names
//   is-callback-function
//   arr-includes
//   get-fn-name
//   get-installed-path
//   detect-installed
//   is-installed
//   is-missing
//   detect-next-version
//   recommended-bump
//   gitcommit
//   git-commits-since
//   gh-download
//   bind-context
//   rename-function
//   function-equal
//   github-clone-labels
//   //create-github-repo // scoped, move to personal
//   create-readdir-stream
//   stream-copy-dir
// `
//  .split('\n')
//  .map((x) => x.trim())
//  .filter((x) => !x.startsWith('//'));

// const tunnckocoreScoped = `
// `
//  .split('\n')
//  .map((x) => x.trim());

// // mappings.add("error-format", "packages/error-format");
