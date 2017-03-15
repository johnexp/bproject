'use strict';

/**
 * Module dependencies
 */
var userMetaPolicy = require('../policies/user-meta.server.policy'),
  userMeta = require('../controllers/user-meta.server.controller');

module.exports = function(app) {
  app.route('/api/user-meta/:book/:chapter').all(userMetaPolicy.isAllowed)
    .get(userMeta.userMetaByChapter)
    .post(userMeta.create)
    .put(userMeta.update);
};
