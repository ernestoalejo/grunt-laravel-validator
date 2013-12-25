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
      mincount: 2,
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

    ffoo: ['string', 'store:foo'],
    fbar: ['string', 'store:bar'],

    conditional: {
      kind: 'conditional',
      condition: '$store[\'foo\'] == \'bar\'',
      requiresStored: ['foo'],
      fields: {
        kind: 'object',
        fields: {
          fstring: ['string'],
        }
      }
    },

    myobj: {
      kind: 'conditional',
      condition: 'true',
      fields: ['string', 'required'],
    },

    myarr: {
      kind: 'array',
      fields: {
        kind: 'conditional',
        condition: false,
        fields: ['integer'],
      },
    },

    myarr_extended: {
      kind: 'array',
      fields: {
        kind: 'conditional',
        condition: false,
        fields: {
          kind: 'object',
          fields: {
            qux: {
              kind: 'conditional',
              condition: '$store[\'bar\'] === \'bar\'',
              requiresStored: ['bar'],
              fields: {
                kind: 'object',
                fields: {
                  myqux: ['boolean'],
                },
              },
            },
          },
        },
      },
    },

    myarr_recursive: {
      kind: 'array',
      fields: {
        kind: 'array',
        fields: {
          kind: 'array',
          fields: {
            kind: 'array',
            fields: {
              kind: 'conditional',
              condition: 'true != false',
              fields: ['string'],
            },
          },
        },
      },
    },

    foo: {
      kind: 'switch',
      requiresStored: ['bar'],
      cases: [
        {
          condition: '$store["bar"] === "baz"',
          fields: ['string', 'required'],
        },
        {
          condition: '$store["bar"] === "qux"',
          fields: ['integer', 'positive'],
        },
      ],
    },
  };
};

