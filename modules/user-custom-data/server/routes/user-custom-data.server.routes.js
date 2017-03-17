'use strict';

/**
 * Module dependencies
 */
var userCustomDataPolicy = require('../policies/user-custom-data.server.policy'),
  userCustomData = require('../controllers/user-custom-data.server.controller');

module.exports = function(app) {

  app.route('/api/user-custom-data').all(userCustomDataPolicy.isAllowed)
    .get(userCustomData.getUserCustomData)
    .post(userCustomData.createUserCustomData)
    .put(userCustomData.updateUserCustomData);

};
