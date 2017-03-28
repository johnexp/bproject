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
        userBibleData = createUserBibleDataObj(req);
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

  saveVerseReferredTo(userBibleData);

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

  saveVerseReferredTo(userBibleData);

  if (userBibleData.refs.length === 0 && userBibleData.notes.length === 0 && userBibleData.markers.length === 0 && userBibleData.tags.length === 0) {
    deleteUserBibleData(userBibleData, req, res);
    return;
  }

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

/**
 * Filter User Notes
 */
exports.filterNotes = function (req, res) {
  var pipeline = [
    { $unwind: '$notes' },
    { $unwind: '$notes.note' },
    { $project: { _id: 1, book: 1, chapter: 1, verses: '$notes.verses', note: '$notes.note' } }
  ];
  if (req.params.searchTerm && req.params.searchTerm !== '*') {
    pipeline.splice(2, 0, { $match: { 'notes.note': new RegExp(req.params.searchTerm, 'i') } });
  }
  if (req.params.book) {
    pipeline.splice(2, 0, { $match: { 'notes.note': new RegExp(req.params.searchTerm, 'i') } });
  }
  UserBibleData.aggregate(pipeline,
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
 * Filter User Tags
 */
exports.filterTags = function (req, res) {
  var pipeline = [
    { $unwind: '$notes' },
    { $unwind: '$notes.note' },
    { $project: { _id: 1, book: 1, chapter: 1, verses: '$notes.verses', note: '$notes.note' } },
    { $limit: 200 }
  ];

  // db.getCollection('userbibledatas').aggregate(
  //   { $unwind: '$tags' },
  //   { $unwind: '$tags.tags' },
  //   { $match: { 'tags.tags': { $in: ['Vish', 'test'] } } },
  //   //{ $unwind: '$notes.note' },
  //   { $project: { _id: 1, book: 1, chapter: 1, verses: '$tags.verses', note: '$tags.tags' } }
  // )
  if (req.params.searchTerm && req.params.searchTerm !== '*') {
    pipeline.splice(2, 0, { $match: { 'notes.note': new RegExp(req.params.searchTerm, 'i') } });
  }
  if (req.params.book) {
    pipeline.splice(2, 0, { $match: { 'notes.note': new RegExp(req.params.searchTerm, 'i') } });
  }
  UserBibleData.aggregate(pipeline,
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

function createUserBibleDataObj(req) {
  var userBibleData = {};
  userBibleData.book = req.params.book;
  userBibleData.chapter = req.params.chapter;
  userBibleData.markers = [];
  userBibleData.tags = [];
  userBibleData.notes = [];
  userBibleData.refs = [];
  return userBibleData;
}

function deleteUserBibleData(userBibleData, req, res) {
  userBibleData.remove(function (err) {
    if (res) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(createUserBibleDataObj(req));
      }
    }
  });
}

function saveVerseReferredTo(userBibleData) {
  var refsToSave = {};
  var versesRefsToCreate = [];
  for (var i = 0; i < userBibleData.refs.length; i++) {
    for (var j = 0; j < userBibleData.refs[i].refs.length; j++) {
      if (userBibleData.refs[i].refs[j].indexOf('*') > -1) {
        userBibleData.refs[i].refs[j] = userBibleData.refs[i].refs[j].replace('*', '');
        var refArray = userBibleData.refs[i].refs[j].split('-');
        if (!refsToSave[refArray[0] + '-' + refArray[1]]) {
          versesRefsToCreate.push(refArray[0] + '-' + refArray[1]);
          refsToSave[refArray[0] + '-' + refArray[1]] = { refs: [], verse: '' };
        }
        refsToSave[refArray[0] + '-' + refArray[1]].refs.push(userBibleData.refs[i].refs[j]);
        refsToSave[refArray[0] + '-' + refArray[1]].verse = userBibleData.refs[i].verse;
      }
    }
  }

  versesRefsToCreate.forEach(function (refToSave) {
    createOrUpdateRef(userBibleData, refsToSave[refToSave].refs, refsToSave[refToSave].verse);
  });
}

function createOrUpdateRef(userBibleData, refs, verse) {
  var refToSearchArray = refs[0].split('-');
  UserBibleData.findOne({
    'user': userBibleData.user,
    'book': refToSearchArray[0],
    'chapter': refToSearchArray[1]
  })
  .exec(function (err, newUserBibleData) {
    if (!newUserBibleData) {
      newUserBibleData = new UserBibleData({ book: refToSearchArray[0], chapter: refToSearchArray[1], refs: [], user: userBibleData.user });
    }
    for (var i = 0; i < refs.length; i++) {
      var refToAddArray = refs[i].split('-');
      saveRefs(refToAddArray, newUserBibleData, userBibleData, verse);
    }

    if (newUserBibleData.refs.length === 0 && newUserBibleData.notes.length === 0 && newUserBibleData.markers.length === 0 && newUserBibleData.tags.length === 0) {
      deleteUserBibleData(newUserBibleData);
    }
  });
}

function saveRefs(ref, newUserBibleData, userBibleData, verse) {
  newUserBibleData.refs.push({ refs: [userBibleData.book + '-' + userBibleData.chapter + '-' + verse], verse: ref[2] });
  newUserBibleData.save();
}
