module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 2018,
        sourceType: 'module',
        validate: ['javascript', 'javascriptreact', 'html', 'vue', 'vue-html'],
        extensions: ['.vue'],
        ecmaFeatures: {},
    },
    env: {
        es6: true,
        browser: true,
        node: true,
    },
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    extends: ['eslint:recommended', 'airbnb-base', 'plugin:vue/strongly-recommended', 'prettier'],
    // required to lint *.vue files
    plugins: ['vue', 'prettier'],
    globals: {
        ga: true, // Google Analytics
        cordova: true,
        __statics: true,
    },
    // add your custom rules here
    rules: {
        'object-curly-newline': [
            'error',
            {
                consistent: true,
            },
        ],
        'no-param-reassign': 0,
        indent: ['error', 4],
        'import/first': 0,
        'import/named': 2,
        'import/namespace': 2,
        'import/default': 2,
        'import/export': 2,
        'import/extensions': 0,
        'import/no-unresolved': 0,
        'import/no-extraneous-dependencies': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        semi: 'off',
        curly: 'off',
        'max-len': [
            'error',
            {
                code: 7000,
                ignoreComments: true,
                ignoreStrings: true,
            },
        ],
        'no-multi-spaces': 'off',
        'arrow-body-style': 'off',
        'comma-dangle': 'off',
        'no-param-reassign': [
            'warn',
            {
                props: false,
            },
        ],
        'linebreak-style': 'off',
        'arrow-parens': 'off',
        quotes: 'off',
        'keyword-spacing': 'off',
        'no-restricted-syntax': 'off',
        'guard-for-in': 'off',
        'space-before-blocks': 'off',
        'brace-style': 'off',
        'import/no-dynamic-require': 'off',
        // TODO : put this back in
        'no-console': 'off',
        // 'no-console': [
        //     'warn',
        //     {
        //         allow: ['warn', 'error'],
        //     },
        // ],
        'no-shadow': [
            'error',
            {
                allow: ['resolve', 'reject', 'done', 'cb'],
            },
        ],
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'import/prefer-default-export': 'off',
        'vue/html-indent': 'off', // handled by beautify
        'vue/max-attributes-per-line': 'off',

        // TODO fix these rules, made when Quasar 1.0, all part of vue recommended.
        'vue/multiline-html-element-content-newline': 'off',
        'vue/html-quotes': 'off',
        'vue/html-closing-bracket-spacing': 'off',
        'vue/html-closing-bracket-newline': [
            'off',
            {
                singleline: 'never',
                multiline: 'never',
            },
        ],
        'vue/singleline-html-element-content-newline': 'off',
        'vue/html-self-closing': 'off',
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
    },
}
