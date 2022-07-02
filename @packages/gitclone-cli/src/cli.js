#!/usr/bin/env node

'use strict';

const username = require('git-username');
const gitclone = require('gitclone');
const sade = require('sade');
const pkg = require('../package.json');

sade('gitclone [repository]', true)
	.version(pkg.version)
	.describe('Clone a git repository')
	.example('owner/repo')
	.example('repo')
	.example('tunnckoCoreLabs/charlike -s')
	.example('verbose/verb#dev')
	.example('micromatch/micromatch')
	.example('micromatch/micromatch --dest mm')
	.example('facebook/jest')
	.example('-o facebook -n jest')
	.option('-s, --ssh', 'Clone SSH, not https', false)
	.option('-n, --name', 'Repository name, like `charlike`')
	.option('-o, --owner', 'Owner of the repository', username())
	.option('-r, --repo', 'Repository slug, like `facebook/jest`')
	.option('-b, --branch', 'Specific branch or sha hash', 'master')
	.option('-d, --dest', 'Destination place')
	.action((repository, argv) => {
		let repo = repository;
		const opts = { ...argv };

		gitclone.options = { stdio: 'inherit' };

		if (!repo) {
			gitclone(opts);
			return;
		}
		if (repo.includes('#')) {
			const parts = repo.split('#');
			repo = parts[0];
			opts.branch = parts[1];
		}

		if (repo.includes('/')) {
			gitclone(repo, opts);
		} else {
			opts.name = repo;
			gitclone(opts);
		}
	})
	.parse(process.argv);
