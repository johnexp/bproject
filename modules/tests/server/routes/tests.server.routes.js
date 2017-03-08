'use strict';

/**
 * Module dependencies
 */
var testsPolicy = require('../policies/tests.server.policy'),
  tests = require('../controllers/tests.server.controller');

module.exports = function(app) {
  // Tests Routes
  app.route('/api/tests').all(testsPolicy.isAllowed)
    .get(tests.list)
    .delete(tests.changeState)
    .post(tests.filter);

  app.route('/api/tests/enum/:field').all(testsPolicy.isAllowed)
    .get(tests.getEnumValue);

  app.route('/api/tests/:active').all(testsPolicy.isAllowed)
    .get(tests.list);

  app.route('/api/test/:testId').all(testsPolicy.isAllowed)
    .get(tests.read)
    .put(tests.update)
    .delete(tests.changeState);

  app.route('/api/test').all(testsPolicy.isAllowed)
    .post(tests.create);

  // Finish by binding the Test middleware
  app.param('testId', tests.testByID);
  app.param('field', tests.getEnumValue);
};
