'use strict';


module.exports = function(grunt) {
  var path = require('path');

  var exports = {};

  exports.template = function(name, data) {
    var p = path.resolve(path.join(__dirname, '/templates/' + name + '.tpl'));
    return grunt.template.process(grunt.file.read(p), {
      data: data,
    });
  };

  return exports;
};

