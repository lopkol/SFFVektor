'use strict';

module.exports = {
  root: true,
  plugins: ['jasmine', 'react', 'react-hooks'],
  env: {
    browser: true,
    commonjs: true,
    jasmine: true,
    node: true,
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  globals: {
    expectAsync: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    //'react-hooks/exhaustive-deps': 'warn',
    'eol-last': 'warn',
    eqeqeq: 'warn',
    indent: [
      'warn',
      2,
      {
        SwitchCase: 1
      }
    ],
    'keyword-spacing': ['warn'],
    'no-console': 'off',
    'no-prototype-builtins': 'off',
    'no-trailing-spaces': ['warn'],
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
