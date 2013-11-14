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
    ],
    fintegerv: [
      'integer',
      'store:fiv',
      'use:MyNamespace\\MyClass1',
      'custom:$store[\'fiv\'] > 3',
    ],
    fdatev: [
      'string',
      'date',
    ],


    /*
    "Object":      objectField,
    "Array":       arrayField,
    "Conditional": conditionalField,*/
    /*
    page: ['string', 'required'],
    lang: ['string', 'required', 'inarray:Config::get(\'langs\')', 'use:Config'],

    mainMenu: {
      kind: 'object',
      fields: {
        visible: ['boolean', 'store:mainMenuVisible'],

        conditional: {
          check: '$store[\'mainMenuVisible\']',
          fields: {
            label: ['string', 'required', 'minlength:3'],
          }
        },
      },
    },*/
  };
};
