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

  app.route('/api/user-notes-search/:searchTerm/:book*?').all(userBibleDataPolicy.isAllowed)
    .get(userBibleData.filterNotes);

  app.route('/api/user-tags-search/:book*?').all(userBibleDataPolicy.isAllowed)
    .post(userBibleData.filterTags);

  app.route('/api/user-markers-search/:book*?').all(userBibleDataPolicy.isAllowed)
    .post(userBibleData.filterMarkers);

};
