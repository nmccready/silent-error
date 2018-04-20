module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true
  },
  extends: 'eslint:recommended',
  rules: {
    'prefer-destructuring': 'error',
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always']
  },
  overrides: {
    files: ['test.js'],
    env: {
      mocha: true
    }
  }
};
