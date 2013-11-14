'use strict';


module.exports = function() {
  return {
    // All type of fields
    fstring: ['string'],
    finteger: ['integer'],
    fboolean: ['boolean'],

    // All validations for each field
    fstringv: [
      'string',
      'minlength:3',
      'email',
      'store:fsv',
      'custom:$store[\'fsv\'] == \'foo\'',
    ],
    fintegerv: [
      'integer',
      'store:fiv',
      'custom:$store[\'fiv\'] > 3',
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
