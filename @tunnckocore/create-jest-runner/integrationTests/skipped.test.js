const runJest = require('./runJest');

it('Works when it has skipped tests', () => {
  return expect(runJest('skipped')).resolves.toMatchSnapshot();
});
