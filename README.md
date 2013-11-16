# grunt-laravel-validator

> Generate PHP validations that use Laravel from JS descriptions of the input data format

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

### Validator objects
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

When applying processors it's always required to "type" the input value; that is,
to apply the *string*, the *integer* or the *boolean* filter to it before any other
processor in the chain.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
