/*
 * grunt-laravel-validator
 * https://github.com/ernestoalejo/grunt-laravel-validator
 *
 * Copyright (c) 2013 Ernesto Alejo
 * Licensed under the MIT license.
 */
'use strict';


module.exports = function(grunt) {
  var Generator = require('../lib/generator.js')(grunt);

  grunt.registerMultiTask('laravel_validator', 'Generate PHP validations that use Laravel from JS descriptions of the input data format', function() {
    var path = require('path');

    this.files.forEach(function(file) {
      var src = file.src[0];
      if (!grunt.file.exists(src)) {
        grunt.log.warn('Source file "' + src + '" not found.');
        return;
      }
      file.dest = file.dest.replace(/\.js$/i, '.php');

      var source = require(path.resolve(src))();
      var generator = new Generator(source, src);
      grunt.file.write(file.dest, generator.run());

      grunt.log.writeln('File "' + file.dest + '" created.');
    });
  });
};
