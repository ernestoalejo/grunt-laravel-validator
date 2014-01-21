'use strict';


module.exports = function() {
  return {
    // All type of fields
    fstring: ['string'],
    finteger: ['integer'],
    fboolean: ['boolean'],
    ffloat: ['float'],

    fother: ['string', 'store:other'],

    // Most of the allowed processors for each field
    fstringv: [
      'string',
      'email',
      'url',
      'regexp:/^[a-b]$/',

      'length:3',
      'minlength:4',
      'maxlength:5',

      'use:MyNamespace\\MyClass1',
      'use:MyNamespace\\MyClass2',
      'use:MyNamespace\\MyClass1',

      'in:value1,value2,value3',
      ['in', 'before,after', 'before2,after2'],

      'use:Config',
      'inarray:Config::get(\'example\')',

      'match:other',

      'store:fsv',
      'custom:$store[\'fsv\'] == \'foo\'',
    ],
    fintegerv: [
      'integer',

      'use:MyNamespace\\MyClass1',

      'minvalue:3',
      'maxvalue:7',
      'positive',

      'store:fiv',
      'custom:$store[\'fiv\'] > 3',
    ],
    fdatetimev: [
      'string',
      'datetime',
      'mindatetime:today',
      'maxdatetime:tomorrow',
    ],
    ffloatv: [
      'float',
      'minvalue:3',
      'maxvalue:7',
    ],
  };
};
