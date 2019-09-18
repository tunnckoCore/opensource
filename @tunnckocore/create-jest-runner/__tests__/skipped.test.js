const runJest = require('../__support__/runJest');

it('Works when it has skipped tests', async () => {
  const resultString = await runJest('skipped');
  expect(resultString).toEqual(expect.stringContaining('1 skipped, 1 total'));
});
