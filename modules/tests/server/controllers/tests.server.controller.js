'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Test = mongoose.model('Test'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Test
 */
exports.create = function(req, res) {
  var test = new Test(req.body);
  test.user = req.user;
  test.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'C' });

  test.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(test);
    }
  });
};

/**
 * Show the current Test
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var test = req.test ? req.test.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  test.isCurrentUserOwner = req.user && test.user && test.user._id.toString() === req.user._id.toString();

  res.jsonp(test);
};

/**
 * Update a Test
 */
exports.update = function(req, res) {
  var test = req.test;

  test = _.extend(test, req.body);
  test.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'U' });

  test.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(test);
    }
  });
};

/**
 * Change activation state of a Test
 */
exports.changeState = function(req, res) {
  var test = req.test;
  test.active = !test.active;
  var state = test.active ? 'A' : 'I';
  test.modified.push({ 'date': Date.now(), 'user': req.user, 'action': state });

  test.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(test);
    }
  });
};

/**
 * List of Tests
 */
exports.list = function(req, res) {
  var objFilter = {};
  if (req.params.hasOwnProperty('active')) {
    objFilter.active = req.params.active;
  }

  Test
    .find(objFilter)
    .sort('-created')
    .populate([{
      path: 'user',
      select: 'displayName'
    }])
    .exec(function(err, tests) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(tests);
      }
    });
};

/**
 * Filter Tests
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
  Test
    .find(filter).sort(pagination.sort)
    .skip(pagination.offset)
    .limit(pagination.limit)
    .populate([{
      path: 'user',
      select: 'displayName'
    }])
    .exec(function(err, tests) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(tests);
      }
    });
};

/**
 * Count Tests
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
  Test.count(filter).exec(function(err, count) {
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
 * Test middleware
 */
exports.testByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Test is invalid'
    });
  }

  Test.findById(id)
    .populate([{
      path: 'user',
      select: 'displayName'
    }, {
      path: 'modified.user',
      select: 'displayName'
    }])
    .exec(function (err, test) {
      if (err) {
        return next(err);
      } else if (!test) {
        return res.status(404).send({
          message: 'No Test with that identifier has been found'
        });
      }
      req.test = test;
      next();
    });
};

/**
 * Get available values of a enum
 */
exports.getEnumValue = function(req, res, next, field) {
  try {
    var enumValues = Test.schema.path(field).enumValues;
    res.jsonp(enumValues);
  } catch (ex) {
    return res.status(400).send({
      message: 'The field "' + field + '" is not a valid enum.'
    });
  }
};
