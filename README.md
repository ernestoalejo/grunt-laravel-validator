# grunt-laravel-validator

> Generate PHP validations from short and concise descriptions of the input format.

**NOTE:** This project is not related to the Laravel official Validator class. It's
a stricter and statically generated alternative to it.

To read more about the format of the validator files see the [laravel-validator](https://github.com/ernestoalejo/laravel-validator) project directly.


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
          src: '**/*.val',
          cwd: 'app/validators',
          dest: 'app/lib/Validators',
          expand: true,
        },
      ],
    },
  },
})
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


## Release History
* 2014-02-22   v1.0.0   Use the independent laravel-validator library with the new file format.
* 2014-01-21   v0.6.0   Remove date, mindate & maxdate processors. Use datetime, mindatetime & maxdatetime instead.
* 2014-01-20   v0.5.10  Use the same timezone for comparisons.
* 2014-01-20   v0.5.9   Fix typo.
* 2014-01-20   v0.5.8   Compare and save dates in the correct timezones.
* 2014-01-20   v0.5.7   Another fix: use carbon modifiers.
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
