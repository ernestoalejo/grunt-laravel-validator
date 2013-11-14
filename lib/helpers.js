'use strict';


module.exports = function(grunt) {
  var exports = {}

  exports.template = function(name, data) {
    return grunt.template.process(grunt.file.read('./lib/templates/' + name + '.tpl'), {
      data: data,
    });
  };

  return exports;
};

