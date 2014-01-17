'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    clean: {
      dist: ['dist', 'docs']
    },
    jshint: {
      options: {
        node: true,
        browser: true,
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
        undef: true,
        unused: true,
        strict: true,
        trailing: true,
        '-W098': true, // ignore defined parameters that are never used in methods
        globals: {
        }
      },
      src: ['src/{,*/}*.js'],
      grunt: {
        options: {
          indent: 2
        },
        src: ['Gruntfile.js']
      },
      package: {
        options: {
          indent: 2,
          quotmark: 'double'
        },
        src: ['package.json']
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/PG.min.js': [
            'src/PG.js'
          ]
        }
      }
    },
    jsdoc: {
      basic: {
        src: ['src/{,*/}*.js'],
        options: {
          destination: 'docs/basic',
          private: false
        }
      }
    }
  });

  grunt.registerTask('default', ['clean', 'jshint', 'uglify']);
  grunt.registerTask('build', ['uglify']);
  grunt.registerTask('docs', ['jsdoc']);
};
