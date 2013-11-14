'use strict';

module.exports = function(grunt) {
  var inspect = require('util').inspect;
  var helpers = require('./helpers')(grunt),
    path = require('path'),
    changeCase = require('change-case'),
    processors = require('./processors'),
    array = require("array-extended");


  var Generator = function(source, filepath) {
    this.source = source;
    this.filepath = filepath;

    this.validations = [];
    this.uses = [];

    this.classname = path.basename(filepath, path.extname(filepath));
    this.classname = changeCase.upperCaseFirst(changeCase.camelCase(this.classname));
  };


  Generator.prototype.run = function() {
    this.buildValidations();

    var uses = '';
    if (this.uses.length > 0) {
      uses = 'use ' + array.unique(this.uses).join(';\nuse ') + ';';
    }

    var data = {
      classname: this.classname,
      filepath: this.filepath,
      validations: this.validations.join('\n'),
      uses: uses,
    };
    return helpers.template('base', data);
  };


  Generator.prototype.buildValidations = function() {
    this.buildObject(this.source, 'data', 'valid');
  };


  Generator.prototype.buildObject = function(obj, objname, resname) {
    for (var name in obj) {
      // Object specific validations per key
      this.validations.push(helpers.template('pre-object-key', {
        object: objname,
        name: name,
      }));

      this.runProcessors(name, objname, obj[name]);

      // Object specific validations per key
      this.validations.push(helpers.template('post-object-key', {
        result: resname,
        name: name,
      }));
    }
  };


  Generator.prototype.runProcessors = function(name, objname, procs) {
    var runned = [], stored = [];

    for (var i = 0; i < procs.length; i++) {
      var proc = procs[i];

      if (Array.isArray(proc)) {
        // Extract advanced format
        args = proc[1];
        proc = proc[0];
      } else {
        // Extract the processor name & args in simple format
        var args = '';
        if (proc.indexOf(':') != -1) {
          var idx = proc.indexOf(':');
          args = proc.substring(idx + 1, proc.length);
          proc = proc.substring(0, idx);
        }
        args = args.split(',');
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

      // Processor dependencies
      if (result.requires) {
        for (var j = 0; j < result.requires.length; j++) {
          if (runned.indexOf(result.requires[j]) == -1) {
            grunt.fatal('\n\tprocessor [' + proc + '] needs [' + result.requires[j] +
                '] before to run correctly\n\tin key: ' + name +
                '\n\tin file: ' + this.filepath);
          }
        }
      }
      if (result.requiresStored) {
        for (var j = 0; j < result.requiresStored.length; j++) {
          if (stored.indexOf(result.requiresStored[j]) == -1) {
            grunt.fatal('\n\tprocessor [' + proc + '] needs stored value [' +
                result.requiresStored[j] + '] before to run correctly\n\tin key: ' +
                name + '\n\tin file: ' + this.filepath);
          }
        }
      }

      // Processor PHP dependencies
      if (result.uses) {
        this.uses = this.uses.concat(result.uses);
      }

      // Processor template
      if (result.template) {
        this.validations.push(helpers.template(result.template, result.data));
      }

      // Save stored values
      if (result.stored) {
        stored.push(result.stored);
      }

      runned.push(proc);
    }
  };

  return Generator;
};


