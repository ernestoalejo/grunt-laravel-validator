'use strict';


module.exports = function() {
  return {
    // All type of fields
    fstring: ['string'],
    finteger: ['integer'],
    fboolean: ['boolean'],

    // Most of the allowed processors for each field
    fstringv: [
      'string',
      'email',
      'url',
      'regexp:/^[a-b]$/',

      'length:3',
      'minlength:4',
      'maxlength:5',

      'store:fsv',

      'use:MyNamespace\\MyClass1',
      'use:MyNamespace\\MyClass2',
      'use:MyNamespace\\MyClass1',
      'custom:$store[\'fsv\'] == \'foo\'',

      'in:value1,value2,value3',
      ['in', ['before,after', 'before2,after2']],

      'use:Config',
      'inarray:Config::get(\'example\')',

      'match:fsv',
    ],
    fintegerv: [
      'integer',

      'store:fiv',
      'use:MyNamespace\\MyClass1',

      'custom:$store[\'fiv\'] > 3',

      'minvalue:3',
      'maxvalue:7',
      'positive',
    ],
    fdatev: [
      'string',
      'date',
      'mindate:today',
    ],
  };
};
