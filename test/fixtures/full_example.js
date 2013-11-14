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
      'minlength:3',
      'email',
      'store:fsv',
      'use:MyNamespace\\MyClass1',
      'use:MyNamespace\\MyClass2',
      'use:MyNamespace\\MyClass1',
      'custom:$store[\'fsv\'] == \'foo\'',
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
