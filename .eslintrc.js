'use strict';

module.exports = {
  root: true,
  plugins: ['react'],
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  globals: {
    expectAsync: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'eol-last': 'warn',
    eqeqeq: 'warn',
    indent: ['warn', 2, {
      SwitchCase: 1
    }],
    'keyword-spacing': ['warn'],
    'no-console': 'off',
    'no-prototype-builtins': 'off',
    'no-unused-vars': 'warn',
    'object-curly-spacing': ['warn', 'always'],
    quotes: ['warn', 'single', 'avoid-escape'],
    semi: ['warn', 'always'],
    'space-before-blocks': 'warn',
    strict: 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
