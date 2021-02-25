module.exports = {
    extends: [
        'eslint-config-qiwi',
        'prettier',
    ],
    rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-prototype-builtins': 'off'
    },
    overrides: [
        {
            'files': ['src/test/**/*.ts'],
            'rules': {
                'unicorn/consistent-function-scoping': 'off',
                'unicorn/no-null': 'off'
            }
        }
    ]
};
