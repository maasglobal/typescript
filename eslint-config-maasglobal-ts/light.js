
/* eslint-disable @typescript-eslint/naming-convention */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const prettierrc = require('./prettierrc.js');

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'simple-import-sort', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/array-type': [1, { default: 'generic' }],
    '@typescript-eslint/naming-convention': [
      1,
      {
        selector: 'default',
        format: ['PascalCase', 'camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/prefer-interface': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-inferrable-types': 1,
    '@typescript-eslint/no-object-literal-type-assertion': [0],
    '@typescript-eslint/no-unused-vars': [
      1,
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
    '@typescript-eslint/consistent-type-definitions': [1, 'type'],
    '@typescript-eslint/prefer-optional-chain': [1],
    '@typescript-eslint/consistent-type-assertions': [1],
    'import/no-default-export': 1,
    'import/no-unresolved': 0,
    'import/order': 0,
    'import/named': 0,
    'simple-import-sort/imports': 1,
    'prettier/prettier': [0, prettierrc],
  },
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.*'],
      env: {
        jest: true,
      },
    },
    {
      files: ['types/**/*.d.ts'],
      rules: {
        'import/no-default-export': 0,
      },
    },
  ],
};
