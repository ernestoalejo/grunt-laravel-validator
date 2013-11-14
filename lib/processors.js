'use strict';


module.exports = {
  string: function(generator, object, name) {
    return {
      template: 'string',
      data: {
        object: object,
        name: name,
      },
    };
  },

  integer: function(generator, object, name) {
    return {
      template: 'integer',
      data: {
        object: object,
        name: name,
      },
    };
  },

  boolean: function(generator, object, name) {
    return {
      template: 'boolean',
      data: {
        object: object,
        name: name,
      },
    };
  },

  required: function(generator, object, name) {
    return {
      template: 'required',
      data: {
        name: name,
      },
    };
  },

  minlength: function(generator, object, name, args) {
    if (args.length != 1 || !parseInt(args[0], 10)) {
      throw new Error('minlength validation needs an integer as the first arg only');
    }

    return {
      template: 'minlength',
      data: {
        name: name,
        length: args[0],
      },
    };
  },
};

