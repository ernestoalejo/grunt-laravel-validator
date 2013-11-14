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
      requires: ['string'],
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

  /*

func inValidation(e *emitter, f *field, v *validator) error {
  if v.Value == "" {
    return fmt.Errorf("In filter needs a list of items as value")
  }

  val := strings.Join(strings.Split(v.Value, ","), `', '`)
  e.emitf(`if (!in_array($value, array('%s'), TRUE)) {`, val)
  e.emitf(`  self::error($data, 'key ' . %s . ' breaks the in validation');`, f.Key)
  e.emitf(`}`)
  return nil
}

func inArrayValidation(e *emitter, f *field, v *validator) error {
  if v.Value == "" {
    return fmt.Errorf("InArray filter needs a list of items as value")
  }

  e.emitf(`if (!in_array($value, %s, TRUE)) {`, v.Value)
  e.emitf(`  self::error($data, 'key ' . %s . ' breaks the inarray validation');`, f.Key)
  e.emitf(`}`)
  return nil
}

func lengthValidation(e *emitter, f *field, v *validator) error {
  val, err := strconv.ParseInt(v.Value, 10, 64)
  if err != nil {
    return fmt.Errorf("cannot parse length number: %s", err)
  }

  e.emitf(`if (Str::length($value) != %d) {`, val)
  e.emitf(`  self::error($data, 'key ' . %s . ' breaks the length validation');`, f.Key)
  e.emitf(`}`)
  return nil
}

func matchValidation(e *emitter, f *field, v *validator) error {
  if v.Value == "" {
    return fmt.Errorf("Match filter needs a field name as value")
  }

  e.emitf(`if ($value != $store['%s']) {`, v.Value)
  e.emitf(`  self::error($data, 'key ' . %s . ' breaks the match validation');`, f.Key)
  e.emitf(`}`)
  return nil
}

func maxLengthValidation(e *emitter, f *field, v *validator) error {
  val, err := strconv.ParseInt(v.Value, 10, 64)
  if err != nil {
    return fmt.Errorf("cannot parse maxlength number: %s", err)
  }

  e.emitf(`if (Str::length($value) > %d) {`, val)
  e.emitf(`  self::error($data, 'key ' . %s . ' breaks the maxlength validation');`, f.Key)
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

func minLengthValidation(e *emitter, f *field, v *validator) error {
  val, err := strconv.ParseInt(v.Value, 10, 64)
  if err != nil {
    return fmt.Errorf("cannot parse minlength number: %s", err)
  }

  e.emitf(`if (Str::length($value) < %d) {`, val)
  e.emitf(`  self::error($data, 'key ' . %s . ' breaks the minlength validation');`, f.Key)
  e.emitf(`}`)
  return nil
}

func minLengthOptionalValidation(e *emitter, f *field, v *validator) error {
  val, err := strconv.ParseInt(v.Value, 10, 64)
  if err != nil {
    return fmt.Errorf("cannot parse minlength number: %s", err)
  }

  e.emitf(`if ($value !== '' && Str::length($value) < %d) {`, val)
  e.emitf(`  self::error($data, 'key ' . %s . ' breaks the minlength validation');`, f.Key)
  e.emitf(`}`)
  return nil
}

func minValueValidation(e *emitter, f *field, v *validator) error {
  val, err := strconv.ParseInt(v.Value, 10, 64)
  if err != nil {
    return fmt.Errorf("cannot parse minvalue number: %s", err)
  }

  e.emitf(`if ($value < %d) {`, val)
  e.emitf(`  self::error($data, 'key ' . %s . ' breaks the minvalue validation');`, f.Key)
  e.emitf(`}`)
  return nil
}

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

func requiredValidation(e *emitter, f *field, v *validator) error {
  e.emitf(`if (Str::length($value) == 0) {`)
  e.emitf(`  self::error($data, 'key ' . %s . ' breaks the required validation');`, f.Key)
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
*/

};

