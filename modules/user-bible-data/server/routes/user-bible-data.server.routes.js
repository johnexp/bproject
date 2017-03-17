'use strict';

/**
 * Module dependencies
 */
var userBibleDataPolicy = require('../policies/user-bible-data.server.policy'),
  userBibleData = require('../controllers/user-bible-data.server.controller');

module.exports = function(app) {
  app.route('/api/user-bible-data/:book/:chapter').all(userBibleDataPolicy.isAllowed)
    .get(userBibleData.userBibleDataByChapter)
    .post(userBibleData.createUserBibleData)
    .put(userBibleData.updateUserBibleData);

};
