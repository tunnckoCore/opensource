module.exports = {
  dirs: ['src'],
  createList: [
    {
      input: '_package.json',
      output: 'package.json',
    },
    {
      input: '_README.md',
      output: 'README.md',
    },
    {
      input: 'index.js',
      output: 'src/index.js',
    },
    {
      input: 'run.js',
      output: 'src/run.js',
    },
  ],
};
