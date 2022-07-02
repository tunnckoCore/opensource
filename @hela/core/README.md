# The Hela Project

> Hela v4. Powerful, simple and fast software development and management system.

## More docs soon

## Highlights

- Support for monorepos and non-monorepo setups
- Supports multiple fixed and/or multiple independent-versioned projects
  - example is this repo: `@hela`, `*asia*` and `*xaxa*` packages are fixed, the
    others are not
  - it doesn't really matter, you can do whatever mix you want, hence the
    composable functions and commands
- Similar to `lerna` or other monorepo tools
- Familiar syntax and user experience
- Smaller, faster, more powerful
- Works with or without `git`
- Seamlessly works with NPM Workspaces or Yarn Workspaces
- Use `hela publish <...packages>` to publish
- Use `hela version <semver> <...packages>` before `hela publish` to just bump
- Development since 2017, last rewrite 2022 was from the ground up
- Shareable configs and presets, like `@hela/preset-workspaces` and
  `@hela/preset-tunnckocore`

## Try

You can try @tunnckoCore's config `@hela/preset-tunnckocore` which includes:

- all commands from `@hela/preset-workspaces`
- plus, `lint`, `test`, and `format`
- how? in `package.json` pass `"hela": "@hela/preset-tunnckocore"`
- or create a `hela.config.js` file (accepts ESM)
- which can just `export default import('@hela/preset-tunnckocore');`

## Install

This is ESM-only module and requires Node.js v16+

```
npm i -D @hela/cli @hela/preset-workspaces
```

then in your `package.json` (automatically reads the `workspaces` field, below
are just example ones)

<!-- prettier-ignore-start -->
```json
{
	"hela": "@hela/preset-workspaces",
	"workspaces": [
		"packages/*",
		"@scoped/*",
		"xaxa/*",
		"modules/*"
	]
}
```

**Note:** Keep in mind it also support nested monorepos, just define them first, like so:


```json
{
	"hela": "@hela/preset-workspaces",
	"workspaces": [
		"packages/@tunnckocore/*",
		"packages/*",
		"modules/xaxa/*",
		"modules/*"
	]
}
```

<!-- prettier-ignore-end -->

and print the help

```
hela --help

Usage:
  $ hela <command> [options]

Commands:
  init                         Resolve workspaces and packages information
  affected [name]              List affected workspaces of change in `name` package
  filter <...patterns>         List all packages matching a given filter pattern
  publish <...packages>        Publish given package names, using `npm publish -ws`.
  workspaces [name]            Load workspace graph file, or list resolved workspace(s)
  version <semver> <...names>  Bump version of packages given in --filter flag

For more info, run any command with the `--help` flag:
  $ hela init --help
  $ hela affected --help

Flags:
  -h, --help     Display help message
  -v, --version  Display version
  --cwd          some global flag                     (default: "/home/tunnckocore/opensource")
  --verbose      Print more verbose output            (default: false)
  --showStack    Show more detailed info when errors  (default: false)
  -c, --config   Path to config file                  (default: "hela.config.js")

# initialize monorepo setup
hela init --verbose

hela filter --help
hela publish --help
hela version --help

```
