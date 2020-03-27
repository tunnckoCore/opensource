module.exports =
  process.env.NODE_ENV === 'test'
    ? { plugins: ['@babel/plugin-transform-modules-commonjs'] }
    : {};
