'use strict';
module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        // Task configuration.
        clean: {
            all: ['dist']
        },
        jshint: {
            options: {
                browser: true,
                es5: true,
                esnext: true,
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                indent: 4,
                latedef: true,
                newcap: true,
                noarg: true,
                quotmark: 'single',
                regexp: true,
                undef: true,
                unused: true,
                strict: true,
                trailing: true,
                devel: true,
                '-W098': true, // ignore defined variables that are never used in methods that should be overridden
                globals: {
                    PG: true,
                }
            },
            all: [
                'src/*.js',
            ]
        },
        uglify: {
            dist: {
                files: {
                    'dist/PG.min.js': [
                        'src/PG.js'
                    ]
                }
            }
        }
    });

    grunt.registerTask('build', [
        'clean',
        'jshint',
        'uglify'
    ]);

    grunt.registerTask('default', ['build']);

};