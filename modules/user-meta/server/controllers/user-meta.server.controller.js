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
 * User Meta middleware
 */
exports.userMetaByChapter = function (req, res, next) {
  UserMeta.findOne({
    'user': req.user,
    'book': req.params.book,
    'chapter': req.params.chapter
  })
    .exec(function (err, userMeta) {
      if (err) {
        return next(err);
      } else if (!userMeta) {
        userMeta = {};
        userMeta.book = req.params.book;
        userMeta.chapter = req.params.chapter;
        userMeta.markers = [];
        userMeta.tags = [];
        userMeta.notes = [];
        userMeta.refs = [];
      }
      req.userMeta = userMeta;
      return res.jsonp(userMeta);
    });
};

/**
 * Create a User Meta
 */
exports.create = function (req, res) {
  var userMeta = new UserMeta(req.body);
  userMeta.user = req.user;

  UserMeta.create(userMeta, function (err, userMeta) {
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
  var userMeta = new UserMeta(req.body, { versionKey: '_updatedUserMeta' });
  userMeta.isNew = false;

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
