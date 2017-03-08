'use strict';

/**
 * Module dependencies
 */
var booksPolicy = require('../policies/books.server.policy'),
  books = require('../controllers/books.server.controller');

module.exports = function(app) {

  app.route('/api/book/:abbrev').all(booksPolicy.isAllowed)
    .get(books.bookByAbbrev);

  // Finish by binding the Book middleware
  app.param('abbrev', books.bookByAbbrev);
};
