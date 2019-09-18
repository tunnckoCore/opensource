const runJest = require('../__support__/runJest');

it('Works when it has todo tests', async () => {
  const resultString = await runJest('todo');
  expect(resultString).toEqual(expect.stringContaining('1 passed, 1 total'));
  expect(resultString).toEqual(expect.stringContaining('1 todo, 1 total'));
});
