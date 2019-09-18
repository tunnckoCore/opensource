const runJest = require('../__support__/runJest');

it('Works when it has only passing tests', async () => {
  const resultString = await runJest('passing');
  expect(resultString).toEqual(expect.stringContaining('1 passed, 1 total'));
});
