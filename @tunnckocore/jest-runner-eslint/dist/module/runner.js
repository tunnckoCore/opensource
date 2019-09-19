import { pass, fail, skip } from '@tunnckocore/create-jest-runner';
import { getWorkspacesAndExtensions } from '@tunnckocore/utils';
import cosmiconfig from 'cosmiconfig';
import { CLIEngine } from 'eslint';
const explorer = cosmiconfig('jest-runner');
export default async function jestRunnerESLint({
  testPath,
  config
}) {
  const start = Date.now();
  const options = normalizeOptions(explorer.searchSync(), config.rootDir);

  if (config.setupTestFrameworkScriptFile) {
    require(config.setupTestFrameworkScriptFile);
  }

  const engine = new CLIEngine(options.eslint);

  if (engine.isPathIgnored(testPath)) {
    return skip({
      start,
      end: Date.now(),
      test: {
        path: testPath,
        title: 'ESLint'
      }
    });
  }

  const report = engine.executeOnFiles([testPath]);

  if (options.eslint.fix && !options.fixDryRun) {
    CLIEngine.outputFixes(report);
  }

  const message = engine.getFormatter(options.reporter)(options.quiet ? CLIEngine.getErrorResults(report.results) : report.results);

  if (report.errorCount > 0) {
    return fail({
      start,
      end: Date.now(),
      test: {
        path: testPath,
        title: 'ESLint',
        errorMessage: message
      }
    });
  }

  const tooManyWarnings = options.maxWarnings >= 0 && report.warningCount > options.maxWarnings;

  if (tooManyWarnings) {
    return fail({
      start,
      end: Date.now(),
      test: {
        path: testPath,
        title: 'ESLint',
        errorMessage: `${message}\nESLint found too many warnings (maximum: ${options.maxWarnings}).`
      }
    });
  }

  const result = pass({
    start,
    end: Date.now(),
    test: {
      path: testPath,
      title: 'ESLint'
    }
  });

  if (!options.quiet && report.warningCount > 0) {
    result.console = [{
      message,
      origin: '',
      type: 'warn'
    }];
  }

  return result;
}

function normalizeOptions(val, rootDir) {
  const {
    extensions
  } = getWorkspacesAndExtensions(rootDir);
  const cfg = val && val.config ? val.config : {};
  const eslintOptions = {
    exit: true,
    warnings: false,
    maxWarnings: 10,
    reporter: 'codeframe',
    extensions,
    fix: true,
    reportUnusedDisableDirectives: true,
    ...cfg.eslint,
    cache: true
  };
  return { ...cfg,
    eslint: eslintOptions
  };
}