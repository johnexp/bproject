'use strict';

/**
 * Module dependencies
 */
var booksPolicy = require('../policies/books.server.policy'),
  userMetasPolicy = require('../policies/user-metas.server.policy'),
  books = require('../controllers/books.server.controller');

module.exports = function(app) {

  app.route('/api/book/:version/:abbrev/:chapter').all(booksPolicy.isAllowed)
    .get(books.bookByAbbrev);

  app.route('/api/user-meta/test/:version/:abbrev/:chapter').all(userMetasPolicy.isAllowed)
    .get(books.userMetaByChapter)
    .post(books.create)
    .put(books.update);

  // Finish by binding the Book middleware
  app.param('version', books.bookByAbbrev);
  app.param('abbrev', books.bookByAbbrev);
  app.param('chapter', books.bookByAbbrev);
  app.param('version', books.userMetaByChapter);
  app.param('abbrev', books.userMetaByChapter);
  app.param('chapter', books.userMetaByChapter);

};
