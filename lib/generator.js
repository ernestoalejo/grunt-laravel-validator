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
    this.id = 0;
    this.indent = 0;

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
    for (var key in obj) {
      var name = '\'' + key + '\'';

      // Object specific validations per key
      this.outputBlock(helpers.template('pre-object-key', {
        object: objname,
        name: name,
      }));

      var omitPost = this.runProcessors(name, objname, resname, obj[key]);

      // Object specific validations per key
      if (!omitPost) {
        this.outputBlock(helpers.template('post-object-key', {
          result: resname,
          name: name,
        }));
      }
    }
  };


  Generator.prototype.buildArray = function(arr, objname, resname) {
    var id = this.generateArrayId();

    // Open the for loop
    this.outputBlock(helpers.template('pre-array', {
      object: objname,
      result: resname,
      id: id,
    }));

    // Indent & generate the sub-validations
    this.indent++;
    var omitPost = this.runProcessors('$i' + id, objname, resname, arr.fields);

    if (!omitPost) {
      this.outputBlock(helpers.template('post-array-item', {
        result: resname,
        name: '$i' + id,
      }));
    }
    this.indent--;

    // This post block always has to be here, closing the for loop
    this.outputBlock(helpers.template('post-array'));
  };


  Generator.prototype.runProcessors = function(name, objname, resname, procs) {
    var runned = [], stored = [];

    // Check proccesors type
    if (!Array.isArray(procs)) {
      return this.runRecursive(name, objname, resname, procs);
    }

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
        this.outputBlock(helpers.template(result.template, result.data));
      }

      // Save stored values
      if (result.stored) {
        stored.push(result.stored);
      }

      runned.push(proc);
    }
  };


  Generator.prototype.runRecursive = function(name, objname, resname, procs) {
    if (typeof procs !== 'object') {
      grunt.fatal('\n\tproccesors should be an array or an object' +
        '\n\tin key: ' + name + '\n\tin file: ' + this.filepath);
    }

    if (procs.kind === 'object') {
      // Objects
      this.outputBlock(helpers.template('object', {
        object: objname,
        result: resname,
        name: name,
      }));
      objname += '[' + name + ']';
      resname += '[' + name + ']';
      this.buildObject(procs.fields, objname, resname);
      return true;
    } else if (procs.kind === 'array') {
      // Arrays
      this.outputBlock(helpers.template('array', {
        object: objname,
        result: resname,
        name: name,
      }));
      objname += '[' + name + ']';
      resname += '[' + name + ']';
      this.buildArray(procs, objname, resname);
      return true;
    }

    // Recursive field not recognized
    grunt.fatal('\n\tcollection kind not recognized: ' + procs.kind +
      '\n\tin key: ' + name + '\n\tin file: ' + this.filepath);
  };


  Generator.prototype.generateArrayId = function() {
    return this.id++;
  };


  Generator.prototype.outputBlock = function(block) {
    var prefix = grunt.util.repeat(this.indent, '  ');
    var lines = block.split('\n');
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].length > 0) {
        lines[i] = prefix + lines[i];
      }
    }
    this.validations.push(lines.join('\n'));
  };


  return Generator;
};


