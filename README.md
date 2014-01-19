# grunt-laravel-validator

> Generate PHP validations that use Laravel from JS descriptions of the input data format

**NOTE:** This project is not related to the Laravel official Validator class. It's
a stricter and statically generated alternative to it.


## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-laravel-validator --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-laravel-validator');
```


## The "laravel_validator" task

### Overview
In your project's Gruntfile, add a section named `laravel_validator` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  laravel_validator: {
    target: {
      files: {
        // Target-specific file lists go here.
      },
    },
  },
})
```

### Usage Examples

#### All validator files
In this example all files from the "app/validators" folder will be converted and output
to the "app/lib/Validators" directory.

```js
grunt.initConfig({
  laravel_validator: {
    all: {
      files: [
        {
          src: '**/*.js',
          cwd: 'app/validators',
          dest: 'app/lib/Validators',
          expand: true,
        },
      ],
    },
  },
})
```


## Laravel Usage
To use the validators with Laravel, first import the classes adding this to the 
*psr-0* section of the composer.json file.

```json
"autoload": {
  "psr-0": {
    "Validators": "app/lib"
  }
}
```

Then import and use the validator in your controllers to obtain the input data.

```php
class MyController extends \BaseController {

  public function index() {
    $data = \Validators\MyFolder\MyName::validate();

    $entities = MyEntity::find($data['entity']);

    ....
  }

}
```


## Validator data format
### File global format
Validator files are written in Javascript and imported via *require()*. You have
to export a function that returns an object (the root object).

```js
'use strict';

module.exports = function() {
  return {
    ....
  };
};
```

### Validator objects and processors
Validator objects are pairs of *key: value* items that associates a key in the
input data with the processors it should apply to check it.

```js
return {
  myfield: ['string', 'required', 'email'],
};
```

Processors can require parameters.

```js
return {
  myfield: ['string', 'minlength:3', 'in:foo,bar,baz'],
};
```

Parameters can be passed in an extended format when they contain a colon inside; though
the simple format should always be preferred.

```js
return {
  myfield: [
    'string',
    ['minlength', 3],
    ['in', 'foo', 'bar', 'baz'],
  ],
};
```

When applying processors it's always required to "type" the input value; that is,
to apply the *string*, the *integer*, the *float* or the *boolean* filter to it before any other
processor in the chain.

**NOTE:** If you use "conditional" or "unusedXXX" (XXX could be whatever) the key
will be completely ignored and not generated.


### Arrays and objects

Items are not limited to strings, booleans and integers. The validator can handle
arrays and objects too. Instead of using a list of processors, use an object with the kind and the fields.

Specify the list of processors directly to handle arrays like
*array('myfield' => array('foo', 'bar', 'baz'))*.

```js
return {
  myfield: {
    kind: 'array',
    fields: ['string', 'minlength:3']
  },
};
```

Arrays can require a minimum number of items inside.

```js
return {
  myfield: {
    kind: 'array',
    mincount: 3,
    fields: ['string', 'minlength:3']
  },
};
```

Objects have a similar format. This validator will match objects with this structure:
*array('myfield' => array('subfield1' => 'foo', 'subfield2' => 8))*

```js
return {
  myfield: {
    kind: 'object',
    fields: {
      subfield1: ['string', 'required'],
      subfield2: ['integer', 'minvalue:7'],
    },
  },
};
```

And finally you can combine both, matching arrays of objects.

```js
return {
  labels: {
    kind: 'array',
    fields: {
      kind: 'object',
      fields: {
        id: ['string', 'required'],
        label: ['string', 'required', 'minlength:5'],
      },
    },
  },
};
```

### Conditionals

There is a way to build *if* blocks inside the generated code that allows for conditional validations.

**NOTE:** If you use "conditional" or "unusedXXX" (XXX could be whatever) the key
will be completely ignored and not generated.

```js
return {
  conditional: {
    kind: 'conditional',
    fields: {
      kind: 'object',
      condition: '3 != 2'
      fields: {
        mystr: ['string', 'required'],
      },
    },
  },
};
```

You can directly parse a field in the conditional block. This code will parse
*array('myfield' => 'foo')*.

```js
return {
  myfield: {
    kind: 'conditional',
    condition: 'true',
    fields: ['string', 'required'],
  },
};
```

Finally you can require a stored value for your conditional (see the *store* processor for
more info about this).

```js
return {
  myfield: {
    kind: 'conditional',
    requiresStored: ['myvalue'],
    condition: "$store['myvalue'] === 'foo'",
    fields: ['string', 'required'],
  },
};
```


### Switchs

Chaining *if* blocks for the same validation key can be awkward. Switchs help
to define a list of different validations for the same key depending on a
condition.

```js
return {
  chained: {
    kind: 'switch',
    requiresStored: ['foobar'],
    cases: [
      {
        condition: '$store["foobar"] === "qux"',
        fields: ['string', 'required'],
      },
      {
        condition: '$store["foobar"] === "qux"',
        fields: {
          kind: 'object',
          fields: {
            mykey: ['integer', 'positive'],
          },
        },
      },
    ],
  },
};
```


### Processors

#### boolean
Type the field as a boolean one. *'true', 'false'* (strings); *'1', '0'* (strings & integers);
and 'on', 'off' (strings); are transformed to booleans too.

```js
return {
  mybool: ['boolean'],
};
```

#### custom
Allows custom validations. You have to specify the fail condition. It should always
be used in combination with the *store* processor.

```js
return {
  nonFoo: ['string', 'store:foo', "custom:$store['foo'] == 'foo'"],
};
```

#### date
Validates date format and value. It expects a string in 'Y-m-d' format.

```js
return {
  mydate: ['string', 'date'],
};
```

#### email
Checks if it's a valid email according to the same regular expression angular uses.

```js
return {
  myemail: ['string', 'email'],
};
```

#### float
Type the field as a float one. Strings containing an integer (numbers only) will
be converted. Strings with a decimal point will be converted too. Finally, negative
numbers will be read correctly. Positive numbers preceded by a '+' sign will **not** be accepted.

```js
return {
  intfield: ['float'],
};
```

#### in
Provides a colon-separated list of possible values for the field. If the values
have a colon inside, you can use the extended format.

```js
return {
  myfield: ['string', 'in:value1,value2,value3'],

  extended_field: [
    'string',
    ['in', 'value1,value1', 'value2,value2', 'value3'],
  ],
};
```

#### inarray
A shorthand to check if the string value it's inside a globally available array
(like a config, etc). Probably you'll need to import the global class first
with the *use* processor.

```js
return {
  myfield: ['string', 'use:Config', "in:Config::get('site.langs')"],
};
```

#### integer
Type the field as an integer one. Strings composed of digits only will be converted.

```js
return {
  intfield: ['integer'],
};
```

#### length
Check if the string has the exact length specified as the first parameter.

```js
return {
  myfield: ['string', 'length:10'],

  my_md5_hash: ['string', 'length:32'],
}
```

#### match
Compare two fields to check they're equal. The first parameter is the key where
the other value it's already stored.

```js
return {
  password: ['string', 'minlength:8', 'store:pass'],
  repeat_password: ['string', 'match:pass'],
};
```

#### maxdate
Maximum date allowed. The format it's anything the constructor of the Carbon class
can read. It's inclusive.

```js
return {
  myfield: ['string', 'date', 'maxdate:today'],
};
```

#### maxlength
Maximum length (inclusive) for a string field.

```js
return {
  myfield: ['string', 'maxlength:60'],
};
```

#### maxvalue
Maximum value (inclusive) for an integer field.

```js
return {
  myfield: ['integer', 'maxvalue:1500'],
};
```

#### mindate
Minimum date allowed. The format it's anything the constructor of the Carbon class
can read. It's inclusive.

```js
return {
  myfield: ['string', 'date', 'mindate:today'],
};
```

#### minlength
Minimum length (inclusive) for a string field.

```js
return {
  myfield: ['string', 'minlength:60'],
};
```

#### minvalue
Minimum value (inclusive) for an integer field.

```js
return {
  myfield: ['integer', 'minvalue:1500'],
};
```

#### positive
Requires the integer to be positive.

```js
return {
  myfield: ['integer', 'positive'],
};
```

#### regexp
Checks the value against a regular expression specified as the first parameter.
It's highly recommended to match the whole string (using ^ and $) unless it's
explicitly needed to check only a part of the value.

```js
return {
  myfield: ['string', 'regexp:/^(foo|bar)$/'],
};
```

#### required
Check that a string has at least length one, therefore it's the same as *minlength:1*.

```js
return {
  myfield: ['string', 'required'],
};
```

#### store
Store the value of the field to use it later in custom validations, conditionals
or matchs. The value it's stored in a local array called *store* that you can access
directly using the key provided (see custom validation or conditionals for examples
of how to use it).

```js
return {
  myfield: ['string', 'store:mykey', "custom:$store['mykey'] == 'foo'"],
  otherfield: ['string', 'match:mykey']
};
```

#### string
Type the field as a string. Float & integers will be converted.

```js
return {
  mystr: ['string'],
};
```

#### url
Check if it's a valid URL according to the same regular expression Angular uses.

```js
return {
  myurl: ['string', 'url'],
};
```

#### use
Add required dependencies to load in the PHP file.

```js
return {
  myfield: [
    'string',
    'use:Config',
    "inarray:Config::get('site.langs'),"
  ],
};
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


## Release History
* 2014-01-20   v0.5.6   Another mindate & maxdate fix.
* 2014-01-20   v0.5.5   Make mindate & maxdate inclusive.
* 2013-12-29   v0.5.4   Add validator error to the exception message.
* 2013-12-29   v0.5.3   Url validation doesn't imply required now.
* 2013-12-27   v0.5.2   Convert integer to floats.
* 2013-12-27   v0.5.1   Validations positive, minvalue & maxvalue can be applied to floats too.
* 2013-12-27   v0.5.0   Add maxdate validation.
* 2013-12-25   v0.4.0   Ignore keys starting with "unused". Add switch kind.
* 2013-12-21   v0.3.1   Email validation doesn't imply required now.
* 2013-12-21   v0.3.0   Minlength validation doesn't imply required now.
* 2013-12-17   v0.2.1   Minor validator namespace fix for subfolders.
* 2013-12-15   v0.2.0   Add typed validation: float.
* 2013-12-08   v0.1.7   Less verbose output.
* 2013-12-08   v0.1.6   Fix generated namespaces.
* 2013-12-08   v0.1.5   Fix library files paths.
* 2013-11-28   v0.1.4   Simpler extended validator format.
* 2013-11-18   v0.1.3   Some lint fixes and README updates.
* 2013-11-16   v0.1.0   Release initial laravel_validator task.
