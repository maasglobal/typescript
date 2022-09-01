
/* eslint-disable @typescript-eslint/naming-convention */

module.exports = {
  plugins: ['fp'],
  extends: ['./index.js', 'plugin:fp/recommended'],
  rules: {
    'fp/no-nil': 0,
    'fp/no-rest-parameters': 0,
    'fp/no-unused-expression': 0,
    'fp/no-mutation': [1, { commonjs: true }],
    'fp/no-mutating-methods': 0,
  },
  overrides: [
    {
      files: ['**/__tests__/**/*'],
      rules: {
        'fp/no-throw': 0,
      },
    },
  ],
};
