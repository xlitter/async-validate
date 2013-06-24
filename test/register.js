var util = require('util');
var assert = require('chai').assert;
var schema = require('../index');
var ValidationError = schema.error;

suite("Register validator:", function() {
  var validator = function(rule, value, callback, source) {
    var errors = [];
    var re = /^[^-][a-zA-Z0-9-]+$/;
    if(!re.test(value)) {
      errors.push(new ValidationError(
        util.format("%s is not a valid identifier", rule.field)));
    }
    callback(errors);
  }
  schema.register('id', validator);
  test("invalid custom validator", function() {
    var descriptor = {
      id: {type: "id"},
    }
    var validator = new schema(descriptor);
    validator.validate({id: "-hyphen"}, function(errors, fields) {
      assert.equal(errors.length, 1);
      assert.equal(errors[0].message, "id is not a valid identifier");
    });
  });
  test("valid custom validator", function() {
    var descriptor = {
      id: {type: "id"},
    }
    var validator = new schema(descriptor);
    validator.validate({id: "my-valid-id"}, function(errors, fields) {
      assert.isNull(errors);
      assert.isNull(fields);
    });
  });
});
