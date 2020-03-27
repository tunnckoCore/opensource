module.exports =
  process.env.NODE_ENV === 'test'
    ? { presets: [['babel-preset-optimise', { commonjs: true }]] }
    : {};
