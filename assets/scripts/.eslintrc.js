module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    plugins: ['simple-import-sort'],
    rules: {
        '@typescript-eslint/no-unused-vars': ['warn'],
        'prettier/prettier': 'warn',

        // Сортировка импортов
        'simple-import-sort/imports': 'warn',
        'simple-import-sort/exports': 'warn',
    },
};
