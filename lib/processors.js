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
      requires:['string'],
      uses: ['Str'],
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
      requires: ['string'],
      uses: ['Str'],
      data: {
        name: name,
        length: args[0],
      },
    };
  },

  maxlength: function(generator, object, name, args) {
    if (args.length != 1 || !parseInt(args[0], 10)) {
      throw new Error('maxlength validation needs an integer as the first arg only');
    }

    return {
      template: 'maxlength',
      requires: ['string'],
      uses: ['Str'],
      data: {
        name: name,
        length: args[0],
      },
    };
  },

  length: function(generator, object, name, args) {
    if (args.length != 1 || !parseInt(args[0], 10)) {
      throw new Error('length validation needs an integer as the first arg only');
    }

    return {
      template: 'length',
      requires: ['string'],
      uses: ['Str'],
      data: {
        name: name,
        length: args[0],
      },
    };
  },

  email: function(generator, object, name) {
    return {
      template: 'email',
      requires: ['string'],
      data: {
        name: name,
      },
    };
  },

  store: function(generator, object, name, args) {
    if (args.length != 1) {
      throw new Error('store processor needs a key name as the first arg only');
    }

    return {
      template: 'store',
      stored: args[0],
      data: {
        name: name,
        key: args[0],
      },
    };
  },

  custom: function(generator, object, name, args) {
    if (args.length != 1) {
      throw new Error('custom validation needs a PHP expression as the first arg only');
    }

    return {
      template: 'custom',
      requires: ['store'],
      data: {
        name: name,
        expression: args[0],
      }
    }
  },

  date: function(generator, object, name) {
    return {
      template: 'date',
      uses: ['Carbon\\Carbon'],
      requires: ['string'],
      data: {
        name: name,
      },
    };
  },

  use: function(generator, object, name, args) {
    if (args.length != 1) {
      throw new Error('use processor needs a class name & namespace as the first arg only');
    }

    return {
      uses: [args[0]],
    };
  },

  in: function(generator, object, name, args) {
    if (args.length < 1) {
      throw new Error('in validation needs a list of items to check');
    }

    return {
      requires: ['string'],
      template: 'in',
      data: {
        name: name,
        values: args.join('\', \''),
      },
    };
  },

  inarray: function(generator, object, name, args) {
    if (args.length != 1) {
      throw new Error('inarray validation needs the name of an array of items as the first arg only');
    }

    return {
      requires: ['string'],
      template: 'inarray',
      data: {
        name: name,
        values: args[0],
      },
    };
  },

  match: function(generator, object, name, args) {
    if (args.length != 1) {
      throw new Error('match validation needs the name of the store of the other field as the first arg only');
    }

    return {
      requires: ['string'],
      requiresStored: [args[0]],
      template: 'match',
      data: {
        name: name,
        other: args[0],
      },
    };
  },

  minvalue: function(generator, object, name, args) {
    if (args.length != 1 || !parseInt(args[0], 10)) {
      throw new Error('minvalue validation needs an integer as the first arg only');
    }

    return {
      template: 'minvalue',
      requires: ['integer'],
      data: {
        name: name,
        value: args[0],
      },
    };
  },

  maxvalue: function(generator, object, name, args) {
    if (args.length != 1 || !parseInt(args[0], 10)) {
      throw new Error('maxvalue validation needs an integer as the first arg only');
    }

    return {
      template: 'maxvalue',
      requires: ['integer'],
      data: {
        name: name,
        value: args[0],
      },
    };
  },

  positive: function(generator, object, name) {
    return {
      template: 'positive',
      requires: ['integer'],
      data: {
        name: name,
      },
    };
  },

  /*

func positiveValidation(e *emitter, f *field, v *validator) error {
  e.emitf(`if ($value < 0) {`)
  e.emitf(`  self::error($data, 'key ' . %s . ' breaks the positive validation');`, f.Key)
  e.emitf(`}`)
  return nil
}

func regExpValidation(e *emitter, f *field, v *validator) error {
  if v.Value == "" {
    return fmt.Errorf("Regexp filter needs a regexp as value")
  }

  e.emitf(`if (!preg_match('%s', $value)) {`, v.Value)
  e.emitf(`  self::error($data, 'key ' . %s . ' breaks the regexp validation');`, f.Key)
  e.emitf(`}`)
  return nil
}

func urlValidation(e *emitter, f *field, v *validator) error {
  e.emitf(`if (!preg_match('%s', $value)) {`,
    `/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/`)
  e.emitf(`  self::error($data, 'key ' . %s . ' breaks the url validation');`, f.Key)
  e.emitf(`}`)
  return nil
}

func minDateValidation(e *emitter, f *field, v *validator) error {
  if v.Value == "" {
    return fmt.Errorf("MinDate filter needs a date as value")
  }

  e.addUse("Carbon\\Carbon")

  e.emitf(`if ($value->lt(new Carbon('%s'))) {`, v.Value)
  e.emitf(`  self::error($data, 'key ' . %s . ' breaks the mindate validation');`, f.Key)
  e.emitf(`}`)
  return nil
}

func minCountValidation(e *emitter, f *field, v *validator) error {
  val, err := strconv.ParseInt(v.Value, 10, 64)
  if err != nil {
    return fmt.Errorf("cannot parse mincount number: %s", err)
  }

  e.emitf(`if (count($value) < %d) {`, val)
  e.emitf(`  self::error($data, 'key ' . %s . ' breaks the mincount validation');`, f.Key)
  e.emitf(`}`)
  return nil
}
*/

};

