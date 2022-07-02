const toTestResult = require('./toTestResult');

module.exports = function pass({ start, end, test }) {
	return toTestResult({
		stats: {
			failures: 0,
			pending: 0,
			passes: 1,
			todo: 0,
			start,
			end,
		},
		tests: [{ duration: end - start, ...test }],
		jestTestPath: test.path,
	});
};
