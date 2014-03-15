'use strict';


module.exports = function(validator) {
  validator.string('mystring')
    .required();
};
