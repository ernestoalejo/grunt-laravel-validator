/*
 * grunt-laravel-validator
 * https://github.com/ernestoalejo/grunt-laravel-validator
 *
 * Copyright (c) 2013 Ernesto Alejo
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask('laravel_validator', '', function() {
    var validator = require('laravel-validator');

    this.files.forEach(function(file) {
      var src = file.src[0];
      if (!grunt.file.exists(src)) {
        grunt.log.warn('Source file "' + src + '" not found.');
        return;
      }
      file.dest = file.dest.replace(/\.js$/i, '.php');

      var base = file.orig.cwd ? file.orig.cwd : '.';
      var generated = validator.generate(base, src);
      grunt.file.write(file.dest, generated);

      grunt.verbose.writeln('File "' + file.dest + '" created.');
    });
  });
};
