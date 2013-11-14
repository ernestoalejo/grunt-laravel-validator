'use strict';

module.exports = function(grunt) {
  var inspect = require('util').inspect;
  var helpers = require('./helpers')(grunt),
    path = require('path'),
    changeCase = require('change-case'),
    processors = require('./processors');

  var Generator = function(source, filepath) {
    this.source = source;
    this.filepath = filepath;
    this.validations = [];

    this.classname = path.basename(filepath, path.extname(filepath));
    this.classname = changeCase.upperCaseFirst(changeCase.camelCase(this.classname));
  };

  Generator.prototype.run = function() {
    this.runProcessors();

    var data = {
      classname: this.classname,
      filepath: this.filepath,
      validations: this.validations.join('\n'),
    };
    return helpers.template('base', data);
  };

  Generator.prototype.runProcessors = function() {
    this.runObject(this.source, 'data', 'valid');
  };

  Generator.prototype.runObject = function(obj, objname, resname) {
    for (var name in obj) {
      // Object specific validations per key
      this.validations.push(helpers.template('pre-object-key', {
        object: objname,
        name: name,
      }));

      var procs = obj[name];
      for (var i = 0; i < procs.length; i++) {
        // Extract the process & its args
        var proc = procs[i];
        var args = [];
        if (proc.indexOf(':') != -1) {
          args = proc.split(':').splice(1);
          proc = proc.substring(0, proc.indexOf(':'));
        }
        grunt.verbose.debug('Processing key [' + name + '] with processor [' +
            proc + '] with args: ' + grunt.log.wordlist(args))

        // Check if it exists
        if (!processors[proc]) {
          grunt.fatal('\n\tValidator processor not recognized: ' + proc +
            '\n\tin key: ' + name + '\n\tin file: ' + this.filepath);
        }

        // Run the processor
        try {
          var result = processors[proc](this, objname, name, args);
        } catch(e) {
          grunt.fatal('\n\t' + e + '\n\tin processor: ' + proc +
            '\n\twith args: ' + args +
            '\n\tin key: ' + name + '\n\tin file: ' + this.filepath);
        }
        if (result.template) {
          this.validations.push(helpers.template(result.template, result.data));
        }
      }

      // Object specific validations per key
      this.validations.push(helpers.template('post-object-key', {
        result: resname,
        name: name,
      }));
    }
  };

  return Generator;
};


