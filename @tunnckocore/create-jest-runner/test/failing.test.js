import runJest from './support/runJest';

it('Works when it has failing tests', async () => {
  const resultString = await runJest('failing');
  expect(resultString).toEqual(expect.stringContaining('1 failed, 1 total'));
});
