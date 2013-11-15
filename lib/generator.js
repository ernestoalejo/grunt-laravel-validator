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
      var key = '\'' + name + '\'';

      // Object specific validations per key
      this.validations.push(helpers.template('pre-object-key', {
        object: objname,
        name: name,
        key: key,
      }));

      var omitPost = this.runProcessors(name, key, objname, resname, obj[name]);

      // Object specific validations per key
      if (!omitPost) {
        this.validations.push(helpers.template('post-object-key', {
          result: resname,
          name: name,
        }));
      }
    }
  };


  Generator.prototype.buildArray = function(name, arr, objname, resname) {
    var id = this.generateArrayId();

    this.validations.push(helpers.template('pre-array', {
      object: objname,
      result: resname,
      id: id,
    }));

    this.runProcessors(name, '$i' + id, objname, resname, arr.fields);

    this.validations.push(helpers.template('post-array'));
  };

  /*
func generateArray(e *emitter, varname, result string, fields []*field) error {
  for _, f := range fields {
    f.Key = fmt.Sprintf("$i%d", id)

    if err := generateField(e, f, varname, result); err != nil {
      return fmt.Errorf("generate field failed: %s", err)
    }
    if f.Kind != "Conditional" && f.Kind != "Array" {
      if err := generateValidations(e, f); err != nil {
        return fmt.Errorf("generate validators failed: %s", err)
      }

      if f.Kind != "Object" {
        e.emitf(`$%s[%s] = $value;`, result, f.Key)
      }
    }
    e.emitf("")
  }

  e.unindent()
  e.emitf("}")
  return nil
}
*/


  Generator.prototype.runProcessors = function(name, key, objname, resname, procs) {
    var runned = [], stored = [];

    // Check proccesors type
    if (!Array.isArray(procs)) {
      return this.runRecursive(name, key, objname, resname, procs);
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
        var result = processors[proc](this, objname, name, key, args);
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


  Generator.prototype.runRecursive = function(name, key, objname, resname, procs) {
    if (typeof procs !== 'object') {
      grunt.fatal('\n\tproccessors should be an array or an object' +
        '\n\tin key: ' + name + '\n\tin file: ' + this.filepath);
    }

    if (procs.kind === 'object') {
      // Objects
      this.validations.push(helpers.template('object', {
        object: objname,
        result: resname,
        name: name,
        key: key,
      }));
      objname += '[\'' + name + '\']';
      resname += '[\'' + name + '\']';
      this.buildObject(procs.fields, objname, resname);
      return true;
    } else if (procs.kind === 'array') {
      // Arrays
      this.validations.push(helpers.template('array', {
        object: objname,
        result: resname,
        name: name,
        key: key,
      }));
      objname += '[\'' + name + '\']';
      resname += '[\'' + name + '\']';
      this.buildArray(name, procs, objname, resname);
      return true;
    }

    // Recursive field not recognized
    grunt.fatal('\n\tcollection kind not recognized: ' + procs.kind +
      '\n\tin key: ' + name + '\n\tin file: ' + this.filepath);
  };


  Generator.prototype.generateArrayId = function() {
    return this.id++;
  };


  return Generator;
};


