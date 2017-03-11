'use strict';

/**
 * Module dependencies
 */
var userMetaPolicy = require('../policies/user-meta.server.policy'),
  userMeta = require('../controllers/user-meta.server.controller');

module.exports = function(app) {

  app.route('/api/user-meta/:version/:abbrev/:chapter').all(userMetaPolicy.isAllowed)
    .get(userMeta.userMetaByChapter)
    .post(userMeta.create)
    .put(userMeta.update);

  // Finish by binding the Book middleware
  app.param('version', userMeta.userMetaByChapter);
  app.param('abbrev', userMeta.userMetaByChapter);
  app.param('chapter', userMeta.userMetaByChapter);
};
