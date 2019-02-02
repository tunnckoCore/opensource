const runJest = require('./runJest');

it('Works when it has todo tests', () => {
  return expect(runJest('todo')).resolves.toMatchSnapshot();
});
