module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  extends: [
    'eslint:recommended',
    'next',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'no-useless-escape': 'off',
    'no-console': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@next/next/no-document-import-in-page': 'off',

    // Sort
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          // ext library & side effect imports
          ['^@?\\w', '^\\u0000'],
          // {s}css files
          ['^.+\\.s?css$'],
          // Lib and hooks
          ['^@/lib', '^@/hooks'],
          // static data
          ['^@/data'],
          // components
          ['^@/components'],
          // Other imports
          ['^@/'],
          // relative paths up until 3 level
          [
            '^\\./?$',
            '^\\.(?!/?$)',
            '^\\.\\./?$',
            '^\\.\\.(?!/?$)',
            '^\\.\\./\\.\\./?$',
            '^\\.\\./\\.\\.(?!/?$)',
            '^\\.\\./\\.\\./\\.\\./?$',
            '^\\.\\./\\.\\./\\.\\.(?!/?$)',
          ],
          ['^@/types'],
          // other that didnt fit in
          ['^'],
        ],
      },
    ],
  },
  globals: {
    React: true,
    JSX: true,
  },
};
