module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
    extraFileExtensions: ['.json'],
  },
  plugins: [
    '@typescript-eslint',
    'fp',
    'json',
    'prettier',
    'import',
    'simple-import-sort',
    'deprecation',
  ],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:fp/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:json/recommended',
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
    '@typescript-eslint/prefer-nullish-coalescing': [1],
    '@typescript-eslint/prefer-optional-chain': [1],
    '@typescript-eslint/consistent-type-assertions': [1],
    'fp/no-nil': 0,
    'fp/no-rest-parameters': 0,
    'fp/no-unused-expression': 0,
    'fp/no-mutation': [1, { commonjs: true }],
    'fp/no-mutating-methods': 0,
    'import/no-default-export': 1,
    'import/no-duplicates': 0,
    'import/no-unresolved': 0,
    'import/order': 0,
    'import/named': 0,
    'simple-import-sort/sort': 1,
    'deprecation/deprecation': 1,
    'no-restricted-imports': [1, 'ruins-ts'],
    'prettier/prettier': [
      1,
      {
        printWidth: 90,
        singleQuote: true,
        trailingComma: 'all',
        arrowParens: 'always',
      },
    ],
  },
  overrides: [
    {
      files: ['**/__tests__/**/*'],
      env: {
        jest: true,
      },
      rules: {
        'fp/no-throw': 0,
        'no-restricted-imports': 0,
      },
    },
    {
      files: ['**/__stories__/**/*'],
      rules: {
        'no-restricted-imports': 0,
        'import/no-default-export': 0,
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
