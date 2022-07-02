'use strict';

const fs = require('fs');
const { getWorkspacesAndExtensions } = require('@tunnckocore/utils');
const { CLIEngine } = require('eslint');
const {
	pass,
	fail,
	skip,
	runner,
	utils,
} = require('@tunnckocore/create-jest-runner');

process.env.NODE_ENV = 'lint';

// eslint-disable-next-line max-statements
module.exports = runner('eslint', async (ctx) => {
	const start = Date.now();
	const { testPath, config, runnerConfig, memoizer } = ctx;
	const options = normalizeOptions(runnerConfig, config.rootDir);

	if (config.setupTestFrameworkScriptFile) {
		// eslint-disable-next-line import/no-dynamic-require, global-require
		require(config.setupTestFrameworkScriptFile);
	}

	const fileContents = fs.readFileSync(testPath, 'utf8');
	const engine = new CLIEngine(options);

	if (engine.isPathIgnored(testPath)) {
		return skip({
			start,
			end: Date.now(),
			test: {
				path: testPath,
				title: 'eslint',
			},
		});
	}

	// const linter = new Linter();

	// const result = linter.verifyAndFix(fileContents, eslintConfig);
	// console.log(result);

	const memoizedFn = await memoizer.memoize(
		async (filepath, contents) => {
			const report = engine.executeOnText(contents, filepath);

			if (options.fix && !options.fixDryRun) {
				CLIEngine.outputFixes(report);
			}

			const message = engine.getFormatter(options.reporter)(
				options.quiet
					? CLIEngine.getErrorResults(report.results)
					: report.results,
			);

			return {
				filepath,
				contents,
				report,
				message,
			};
		},
		{ cacheId: 'execute' },
	);

	const res = await utils.tryCatch(async () => {
		const val = await memoizedFn(testPath, fileContents);

		return val;
	});
	if (res.hasError) return res.error;

	const { report, message } = res;

	if (report.errorCount > 0) {
		return fail({
			start,
			end: Date.now(),
			test: {
				path: testPath,
				title: 'eslint',
				errorMessage: message,
			},
		});
	}

	const tooManyWarnings =
		options.maxWarnings >= 0 && report.warningCount > options.maxWarnings;

	if (tooManyWarnings) {
		return fail({
			start,
			end: Date.now(),
			test: {
				path: testPath,
				title: 'eslint',
				errorMessage: `${message}\nESLint found too many warnings (maximum: ${options.maxWarnings}).`,
			},
		});
	}

	const result = pass({
		start,
		end: Date.now(),
		test: {
			path: testPath,
			title: 'eslint',
		},
	});

	if (!options.quiet && report.warningCount > 0) {
		result.console = [
			{
				message,
				origin: '',
				type: 'warn',
			},
		];
	}

	return result;
});

function normalizeOptions(runnerConfig, rootDir) {
	const { extensions } = getWorkspacesAndExtensions(rootDir);

	const eslintOptions = {
		quiet: true,
		warnings: false,
		maxWarnings: 10,
		reporter: 'codeframe',
		extensions,
		fix: true,
		reportUnusedDisableDirectives: true,
		...runnerConfig,
		cache: true,
	};

	return eslintOptions;
}
