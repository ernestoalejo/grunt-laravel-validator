'use strict';

module.exports = function(grunt) {
  var helpers = require('./helpers')(grunt);

  var Generator = function(source) {
    this.source = source;
  };

  Generator.prototype.run = function() {
    var data = {};
    return helpers.template('base', data);
  };

  return Generator;
};


