module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'max-len': 'off',
    'no-console': 'off'
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  }
};
