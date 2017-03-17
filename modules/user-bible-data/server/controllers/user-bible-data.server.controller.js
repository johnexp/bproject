'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  UserBibleData = mongoose.model('UserBibleData'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * User Meta middleware
 */
exports.userBibleDataByChapter = function (req, res, next) {
  UserBibleData.findOne({
    'user': req.user,
    'book': req.params.book,
    'chapter': req.params.chapter
  })
    .exec(function (err, userBibleData) {
      if (err) {
        return next(err);
      } else if (!userBibleData) {
        userBibleData = {};
        userBibleData.book = req.params.book;
        userBibleData.chapter = req.params.chapter;
        userBibleData.markers = [];
        userBibleData.tags = [];
        userBibleData.notes = [];
        userBibleData.refs = [];
      }
      req.userBibleData = userBibleData;
      return res.jsonp(userBibleData);
    });
};

/**
 * Create a User Meta
 */
exports.createUserBibleData = function (req, res) {
  var userBibleData = new UserBibleData(req.body);
  userBibleData.user = req.user;

  UserBibleData.create(userBibleData, function (err, userBibleData) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userBibleData);
    }
  });
};

/**
 * Update a User Meta
 */
exports.updateUserBibleData = function (req, res) {
  var userBibleData = new UserBibleData(req.body, { versionKey: '_updatedUserBibleData' });
  userBibleData.isNew = false;

  userBibleData.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userBibleData);
    }
  });
};
