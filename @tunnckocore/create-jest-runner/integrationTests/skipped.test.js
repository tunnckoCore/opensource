const runJest = require('./runJest');

it('Works when it has failing tests', () => {
  return expect(runJest('skipped')).resolves.toMatchSnapshot();
});
