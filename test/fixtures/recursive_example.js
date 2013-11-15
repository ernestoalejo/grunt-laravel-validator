'use strict';


module.exports = function() {
  return {
    fobj: {
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
    },

    farr: {
      kind: 'array',
      fields: ['string'],
    },

    farrobj: {
      kind: 'array',
      fields: {
        kind: 'object',
        fields: {
          fstring: ['string', 'required'],
        },
      },
    },

    // Diabolic example
    farr1: {
      kind: 'array',
      fields: {
        kind: 'array',
        fields: {
          kind: 'array',
          fields: {
            kind: 'object',
            fields: {
              inner: ['boolean'],
            },
          },
        },
      },
    },
  };
};

