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
    var validator = require('laravel-validator'),
        path = require('path'),
        fs = require('fs');

    this.files.forEach(function(file) {
      var src = file.src[0];
      if (!grunt.file.exists(src)) {
        grunt.log.warn('Source file "' + src + '" not found.');
        return;
      }
      file.dest = file.dest.replace(/\.val$/i, '.php');

      var contents = fs.readFileSync(path.resolve(src));
      if (file.orig.cwd) {
        src = path.relative(file.orig.cwd, src);
      }

      var source = validator.parse(contents.toString());
      var generated = validator.generate(src, source);

      grunt.file.write(file.dest, generated);

      grunt.verbose.writeln('File "' + file.dest + '" created.');
    });
  });
};
