'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Book = mongoose.model('Book'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Book
 */
exports.create = function(req, res) {
  var book = new Book(req.body);
  book.user = req.user;
  book.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'C' });

  book.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(book);
    }
  });
};

/**
 * Show the current Book
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var book = req.book ? req.book.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  book.isCurrentUserOwner = req.user && book.user && book.user._id.toString() === req.user._id.toString();

  res.jsonp(book);
};

/**
 * Update a Book
 */
exports.update = function(req, res) {
  var book = req.book;

  book = _.extend(book, req.body);
  book.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'U' });

  book.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(book);
    }
  });
};

/**
 * Change activation state of a Book
 */
exports.changeState = function(req, res) {
  var book = req.book;
  book.active = !book.active;
  var state = book.active ? 'A' : 'I';
  book.modified.push({ 'date': Date.now(), 'user': req.user, 'action': state });

  book.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(book);
    }
  });
};

/**
 * List of Books
 */
exports.list = function(req, res) {
  var objFilter = {};
  if (req.params.hasOwnProperty('active')) {
    objFilter.active = req.params.active;
  }

  Book
    .find(objFilter)
    .sort('-created')
    .populate([{
      path: 'user',
      select: 'displayName'
    }])
    .exec(function(err, books) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(books);
      }
    });
};

/**
 * Filter Books
 */
exports.filter = function(req, res) {
  if (req.body.hasOwnProperty('queryCount') && req.body.queryCount === true) {
    return count(req.body, res);
  }
  var filter = req.body.hasOwnProperty('filter') ? req.body.filter : {};
  var paramsLength = Object.keys(filter).length;
  var pagination = req.body.hasOwnProperty('pagination') ? req.body.pagination : { sort: '', offset: 0, limit: 10 };
  for (var i = 0; i < paramsLength; i++) {
    var key = Object.keys(filter)[i];
    if (typeof filter[key] === 'string' || filter[key] instanceof String) {
      filter[key] = new RegExp(filter[key], 'i');
    }
  }
  Book
    .find(filter).sort(pagination.sort)
    .skip(pagination.offset)
    .limit(pagination.limit)
    .populate([{
      path: 'user',
      select: 'displayName'
    }])
    .exec(function(err, books) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(books);
      }
    });
};

/**
 * Count Books
 */
function count(body, res) {
  var filter = body.hasOwnProperty('filter') ? body.filter : {};
  var paramsLength = Object.keys(filter).length;
  for (var i = 0; i < paramsLength; i++) {
    var key = Object.keys(filter)[i];
    if (typeof filter[key] === 'string' || filter[key] instanceof String) {
      filter[key] = new RegExp(filter[key], 'i');
    }
  }
  Book.count(filter).exec(function(err, count) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp([count]);
    }
  });
}

/**
 * Book middleware
 */
exports.bookByAbbrev = function(req, res, next, abbrev) {
  Book.findOne({ 'abbrev': abbrev })
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

/**
 * Get available values of a enum
 */
exports.getEnumValue = function(req, res, next, field) {
  try {
    var enumValues = Book.schema.path(field).enumValues;
    res.jsonp(enumValues);
  } catch (ex) {
    return res.status(400).send({
      message: 'The field "' + field + '" is not a valid enum.'
    });
  }
};
