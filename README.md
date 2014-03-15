# grunt-laravel-validator

> Generate PHP validations from short and concise descriptions of the input format.

**NOTE:** This project is not related to the Laravel official Validator class. It's
a stricter and statically generated alternative to it.

To read more about the format of the validator files see the [laravel-validator](https://github.com/ernestoalejo/laravel-validator) project directly.


## Getting Started
This plugin requires Grunt `~0.4.2`

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


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
