const toTestResult = require('./toTestResult');

module.exports = function skip({ start, end, test }) {
	return toTestResult({
		stats: {
			failures: 0,
			pending: 1,
			passes: 0,
			todo: 0,
			start,
			end,
		},
		skipped: true,
		tests: [{ duration: end - start, ...test }],
		jestTestPath: test.path,
	});
};
