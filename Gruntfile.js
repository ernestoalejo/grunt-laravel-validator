/*
 * grunt-laravel-validator
 * https://github.com/ernestoalejo/grunt-laravel-validator
 *
 * Copyright (c) 2013 Ernesto Alejo
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'test/fixtures/*.js',
        '<%= nodeunit.tests %>',
        'lib/**/*.js',
      ],
      options: {
        curly: true,
        immed: true,
        indent: 2,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        quotmark: 'single',
        undef: true,
        unused: true,
        globalstrict: true,
        trailing: true,
        loopfunc: true,
        node: true,
        globals: {
        },
        reporter: require('jshint-stylish'),
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    laravel_validator: {
      min_example: {
        files: [
          {
            src: 'min_example.val',
            cwd: 'test/fixtures',
            dest: 'tmp',
            expand: true,
          },
        ],
      },
      subfolder: {
        files: [
          {
            src: 'subfolder/example.val',
            cwd: 'test/fixtures',
            dest: 'tmp',
            expand: true,
          },
        ],
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'laravel_validator', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
