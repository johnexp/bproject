'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  UserMeta = mongoose.model('UserMeta'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


/**
 * Create a User Meta
 */
exports.create = function (req, res) {
  var userMeta = new UserMeta(req.body);
  userMeta.user = req.user;

  userMeta.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userMeta);
    }
  });
};

/**
 * Update a User Meta
 */
exports.update = function (req, res) {
  var userMeta = req.userMeta;

  userMeta.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userMeta);
    }
  });
};

/**
 * Book middleware
 */
exports.userMetaByChapter = function (req, res, next) {
  UserMeta.findOne({
    'user': req.user,
    'version': { $or: [{ $eq: null }, { $eq: req.params.version }] },
    'book': req.params.abbrev,
    'chapter': req.params.chapter
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
