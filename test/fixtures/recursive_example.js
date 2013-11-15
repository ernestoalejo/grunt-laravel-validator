'use strict';


module.exports = function() {
  return {
    /*fobj: {
      kind: 'object',
      fields: {
        fstring: ['string'],

        fobj2: {
          kind: 'object',
          fields: {
            finteger: ['integer'],
          },
        },
      },
    },*/

    farr: {
      kind: 'array',
      fields: ['string'],
    },
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

