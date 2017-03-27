'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Book = mongoose.model('Book'),
  BooksSearch = mongoose.model('BooksSearch'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Show the current Book
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var book = req.book ? req.book.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  book.isCurrentUserOwner = req.user && book.user && book.user._id.toString() === req.user._id.toString();

  res.jsonp(book);
};

/**
 * Filter Books
 */
exports.filter = function (req, res) {
  var pipeline = [
    { $match: { 'version': req.params.version } },
    { $unwind: '$chapters' },
    { $unwind: '$chapters.verses' },
    { $match: { 'chapters.verses': new RegExp(req.params.searchTerm, 'i') } },
    { $project: { _id: 1, abbrev: 1, book: 1, chapter: '$chapters.number', verse: '$chapters.verses' } },
    { $limit: 50 },
    { $skip : 5 }
  ];
  if (req.params.abbrev) {
    pipeline.unshift({ $match: { 'abbrev': req.params.abbrev } });
  }
  BooksSearch.aggregate(pipeline,
  function(err, result) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(result);
    }
  });
};

/**
 * Book middleware
 */
exports.bookByAbbrev = function (req, res, next) {
  Book.findOne({
    'chapters.number': req.params.chapter,
    'version': req.params.version,
    'abbrev': req.params.abbrev
  }, {
    'chapters.$': 1,
    'version': 1,
    'book': 1,
    'numberOfChapters': 1
  })
    .exec(function (err, book) {
      if (err) {
        return next(err);
      } else if (!book) {
        return res.status(404).send({
          message: 'No Book with that identifier has been found'
        });
      }
      req.book = book;
      return res.jsonp(book);
    });
};
