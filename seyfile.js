'use strict';

let config = new sey.config({
    global: {
        clean: {
            before: ['./build/*']
        }
    },

    common: {
        babel: {
        },

        eslint: {
        },

        less: {
        },

        eser: true
    },

    main: {
        target: 'node',
        standard: 2016,

        banner: [
            '/**',
            ' * leaves',
            ' *',
            ' * @version v0.9.0',
            ' * @link https://leaves.io',
            ' */',
            ''
        ].join('\n'),

        preprocessVars: {
            BUNDLE: 'main'
        },

        ops: [
            {
                src: ['./src/**/*.js', './src/**/*.ts'],
                dest: './build/src/',

                addheader: true,
                eolfix: true,
                lint: true,
                optimize: true,
                preprocess: true,
                transpile: true,
                typescript: true
            },
            {
                src: './etc/**/*.js',
                dest: './build/etc/',

                addheader: true,
                eolfix: true,
                lint: true,
                optimize: true,
                preprocess: true,
                transpile: true
            },
            {
                src: './etc/**/*.ejs',
                dest: './build/etc/',

                eolfix: true
            },
            {
                src: './src/**/*.json',
                dest: './build/src/',

                eolfix: true
            },
            {
                src: './package.json',
                dest: './build/',

                eolfix: true
            },
            {
                src: './public/**/*',
                dest: './build/public/'
            },
            {
                src: './test/*.js',
                test: true
            }
        ]
    }
});

sey.run(config);
