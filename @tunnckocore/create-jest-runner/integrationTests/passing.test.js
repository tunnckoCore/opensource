const runJest = require('./runJest');

it('Works when it has only passing tests', () => {
  return expect(runJest('passing')).resolves.toMatchSnapshot();
});
