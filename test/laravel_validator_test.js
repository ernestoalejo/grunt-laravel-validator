'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.laravel_validator = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  min_example: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/min_example.php');
    var expected = grunt.file.read('test/expected/min_example.php');
    test.equal(actual, expected, 'should describe what the minimum behavior is.');

    test.done();
  },
  full_example: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/full_plain_example.php');
    var expected = grunt.file.read('test/expected/full_plain_example.php');
    test.equal(actual, expected, 'should describe what the full behavior is.');

    test.done();
  },
};
