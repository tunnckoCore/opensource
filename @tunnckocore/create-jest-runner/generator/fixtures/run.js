const fs = require('fs');
const { pass, fail } = require('create-jest-runner');

module.exports = ({ testPath }) => {
  const start = Date.now();
  const contents = fs.readFileSync(testPath, 'utf8');
  const end = Date.now();

  if (contents.includes('⚔️🏃')) {
    return pass({ start, end, test: { path: testPath } });
  }
  const errorMessage = 'Company policies require ⚔️ 🏃 in every file';
  return fail({
    start,
    end,
    test: { path: testPath, errorMessage, title: 'Check for ⚔️ 🏃' },
  });
};
