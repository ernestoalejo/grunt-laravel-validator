'use strict';

var inspect = require('util').inspect;


var Generator = module.exports = function(source) {
  this.source = source;
};


Generator.prototype.run = function() {
  var content = '';
  return content;
};

