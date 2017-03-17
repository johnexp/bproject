'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  UserCustomData = mongoose.model('UserCustomData'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * User Custom Data middleware
 */
exports.getUserCustomData = function (req, res, next) {
  UserCustomData.findOne({
    'user': req.user
  })
    .exec(function (err, userCustomData) {
      if (err) {
        return next(err);
      } else if (!userCustomData) {
        userCustomData = {};
        userCustomData.tags = [];
        userCustomData.colorLegend = [];
      }
      req.userCustomData = userCustomData;
      return res.jsonp(userCustomData);
    });
};

/**
 * Create a User Custom Data
 */
exports.createUserCustomData = function (req, res) {
  var userCustomData = new UserCustomData(req.body);
  userCustomData.user = req.user;

  UserCustomData.create(userCustomData, function (err, userCustomData) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userCustomData);
    }
  });
};

/**
 * Update a User Custom Data
 */
exports.updateUserCustomData = function (req, res) {
  var userCustomData = new UserCustomData(req.body, { versionKey: '_updatedUserCustomData' });
  userCustomData.isNew = false;

  userCustomData.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userCustomData);
    }
  });
};
