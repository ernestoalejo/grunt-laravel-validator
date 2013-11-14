'use strict';


module.exports = function() {
  return {
    // All type of fields
    fstring: ['string'],
    finteger: ['integer'],
    fboolean: ['boolean'],

    /*"Boolean":     booleanField,
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
