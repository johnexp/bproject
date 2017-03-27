'use strict';

/**
 * Module dependencies
 */
var booksPolicy = require('../policies/books.server.policy'),
  books = require('../controllers/books.server.controller');

module.exports = function(app) {

  app.route('/api/book/:version/:abbrev/:chapter').all(booksPolicy.isAllowed)
    .get(books.bookByAbbrev);

  app.route('/api/search/:searchTerm/:version/:abbrev*?').all(booksPolicy.isAllowed)
    .get(books.filter);
};
