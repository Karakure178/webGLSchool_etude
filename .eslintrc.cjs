module.exports = {
  root: true,
  extends: ['eslint:recommended', 'eslint-config-prettier'],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
};
