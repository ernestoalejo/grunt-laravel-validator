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
    this.stored = {};
    this.id = 0;
    this.indent = 0;

    this.classname = path.basename(filepath, path.extname(filepath));
    this.classname = changeCase.upperCaseFirst(changeCase.camelCase(this.classname));
  };


  Generator.prototype.run = function() {
    // Start building validations
    this.buildObject(this.source, 'data', 'valid');

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


  // Generates validations for an object field. 
  //   obj: info of the generator about this object field
  //   objname: name of the base object to extract the value from
  //   resname: name of the base object to save the value to
  Generator.prototype.buildObject = function(obj, objname, resname) {
    for (var key in obj) {
      var name = '\'' + key + '\'';

      // Object specific validations per key
      if (key != 'conditional') {
        this.outputBlock(helpers.template('pre-object-key', {
          object: objname,
          name: name,
        }));
      }

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


  // Generates the validations for an array field.
  //   arr: info of the generator about this array field
  //   objname: name of the base object to extract the value from
  //   resname: name of the base object to save the value to
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


  // Generates the code for a conditional field.
  //   info: info of the generator about this conditional field
  //   objname: name of the base object to extract the value from
  //   resname: name of the base object to save the value to
  Generator.prototype.buildConditional = function(name, info, objname, resname) {
    // Open the if block
    this.outputBlock(helpers.template('pre-conditional', {
      condition: info.condition,
    }));

    // Indent & generate the sub-validations
    this.indent++;
    var omitPost = this.runProcessors(name, objname, resname, info.fields);

    if (!omitPost) {
      this.outputBlock(helpers.template('post-conditional-item', {
        result: resname,
        name: name,
      }));
    }
    this.indent--;

    // This post block always has to be here, closing the if block
    this.outputBlock(helpers.template('post-conditional'));
  };


  // Run processors recursively if needed over all generator fields
  //   name: key of the data array
  //   objname: name of the base object to extract the value from
  //   resname: name of the base object to save the value to
  //   procs: processors to apply to the field
  Generator.prototype.runProcessors = function(name, objname, resname, procs) {
    var runned = {};
    var typed = false;

    // Check proccesors type
    if (!Array.isArray(procs)) {
      return this.runSpecialProcessors(name, objname, resname, procs);
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

      // Flag correctly typed values
      typed = typed || proc === 'string' || proc === 'integer' || proc === 'boolean';

      grunt.verbose.debug('Processing key [' + name + '] with processor [' +
          proc + '] with args: ' + grunt.log.wordlist(args))

      // Check if it exists
      if (!processors[proc]) {
        this.fail(name, 'validator processor not recognized: ' + proc);
      }

      // Run the processor
      try {
        var result = processors[proc](objname, name, args);
      } catch(e) {
        this.fail(name, e + '\n\tin processor: ' + proc + '\n\twith args: ' + args);
      }

      // Processor dependencies
      if (result.requires) {
        for (var j = 0; j < result.requires.length; j++) {
          var r = result.requires[j];
          if (!runned[r]) {
            this.fail(name, 'processor [' + proc + '] needs [' +
                result.requires[j] + '] before to run correctly');
          }
        }
      }
      if (result.requiresStored) {
        for (var j = 0; j < result.requiresStored.length; j++) {
          var s = result.requiresStored[j];
          if (!this.stored[s]) {
            this.fail(name, 'processor [' + proc + '] needs stored value [' +
                result.requiresStored[j] + '] before to run correctly');
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
        // Don't let processors store value before they're really validated
        if (i != procs.length - 1) {
          this.fail(name, 'processor [' + proc + '] has tried to store a value ' +
              'before it was fully validated, move this processor to the end');
        }

        // Mark each stored key as used
        for (var j = 0; j < result.stored.length; j++) {
          var s = result.stored[j];
          if (this.stored[s]) {
            this.fail(name, 'processor [' + proc + '] has tried to store again [' + s +
                + '], though it is already used by other processor');
          }
          this.stored[s] = true;
        }
      }

      runned[proc] = true;
    }

    if (!typed) {
      this.fail(name, 'field not fully typed, use string, integer or boolean processor');
    }
  };


  // Run recursive validation block (objects, arrays & conditionals)
  //   name: key of the data array
  //   objname: name of the base object to extract the value from
  //   resname: name of the base object to save the value to
  //   info: generator data about this field
  Generator.prototype.runSpecialProcessors = function(name, objname, resname, info) {
    if (typeof info !== 'object') {
      this.fail(name, 'proccesors should be an array or an object');
    }

    if (info.kind === 'object') {
      if (name != '\'conditional\'') {
        this.outputBlock(helpers.template('object', {
          object: objname,
          result: resname,
          name: name,
        }));

        objname += '[' + name + ']';
        resname += '[' + name + ']';
      }
      this.buildObject(info.fields, objname, resname);

      return true;
    }

    if (info.kind === 'array') {
      if (name != '\'conditional\'') {
        this.outputBlock(helpers.template('array', {
          object: objname,
          result: resname,
          name: name,
        }));

        objname += '[' + name + ']';
        resname += '[' + name + ']';
      }
      this.buildArray(info, objname, resname);

      return true;
    }

    if (info.kind === 'conditional') {
      if (info.requiresStored) {
        for (var i = 0; i < info.requiresStored.length; i++) {
          if (!this.stored[info.requiresStored[i]]) {
            this.fail(name, 'conditional needs stored values [' + info.requiresStored[i] +
                '] before to run correctly');
          }
        }
      }

      this.buildConditional(name, info, objname, resname);

      return true;
    }

    // Recursive field not recognized
    this.fail(name, 'collection kind not recognized: ' + info.kind);
  };


  // Generates and returns a new array id (used for loop counters)
  Generator.prototype.generateArrayId = function() {
    return this.id++;
  };


  // Prepare a new validation block, indenting it line by line if needed
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


  // Generate a better fail message when an error it's found in the
  // input data format
  Generator.prototype.fail = function(name, msg) {
    grunt.fatal('\n\t' + msg + '\n\tin key: ' + name + '\n\tin file: ' + this.filepath);
  };


  return Generator;
};


