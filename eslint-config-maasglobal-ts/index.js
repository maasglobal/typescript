
/* eslint-disable @typescript-eslint/naming-convention */

module.exports = {
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  plugins: ['deprecation'],
  extends: ['./light.js'],
  rules: {
    '@typescript-eslint/prefer-nullish-coalescing': [1],
    'deprecation/deprecation': 1,
  },
};
