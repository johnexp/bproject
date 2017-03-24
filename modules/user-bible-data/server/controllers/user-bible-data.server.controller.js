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

function saveVerseReferredTo(userBibleData) {
  var refsToSave = {};
  for (var i = 0; i < userBibleData.refs.length; i++) {
    for (var j = 0; j < userBibleData.refs[i].refs.length; j++) {
      if (userBibleData.refs[i].refs[j].indexOf('*') > -1) {
        userBibleData.refs[i].refs[j] = userBibleData.refs[i].refs[j].replace('*', '');
        var refArray = userBibleData.refs[i].refs[j].split('-');
        if (!refsToSave[refArray[0] + '-' + refArray[1]]) {
          refsToSave[refArray[0] + '-' + refArray[1]] = { refs: [], verse: '' };
        }
        refsToSave[refArray[0] + '-' + refArray[1]].refs.push(userBibleData.refs[i].refs[j]);
        refsToSave[refArray[0] + '-' + refArray[1]].verse = userBibleData.refs[i].verse;
      }
    }
  }

  console.log(refsToSave);
  refsToSave.forEach(function (refToSave) {
    console.log('entrouAqui');
    createOrUpdateRef(userBibleData, refToSave.refs, refToSave.verse);
  });
}

function createOrUpdateRef(userBibleData, refs, verse) {

  var refToSearchArray = refs[0].split('-');
  console.log(refToSearchArray);
  UserBibleData.findOne({
    'user': userBibleData.user,
    'book': refToSearchArray[0],
    'chapter': refToSearchArray[1]
  })
  .exec(function (err, newUserBibleData) {
    for (var i = 0; i < refs.length; i++) {
      var refToAddArray = refs[i].split('-');
      console.log('VERSE_REF_TO_ADD: ' + refToAddArray);
      if (!newUserBibleData) {
        createRefs(refToAddArray, userBibleData, verse);
      } else {
        updateRefs(refToAddArray, newUserBibleData, userBibleData, verse);
      }
    }
  });
}

function createRefs(ref, userBibleData, verse) {
  var newUserBibleData = { book: ref[0], chapter: ref[1], refs: [], user: ref.user };
  newUserBibleData.refs.push({ refs: [userBibleData.book + '-' + userBibleData.chapter + '-' + verse], verse: ref[2] });
  newUserBibleData = new UserBibleData(newUserBibleData);
  newUserBibleData.save();
}

function updateRefs(ref, newUserBibleData, userBibleData, verse) {
  newUserBibleData.refs.push({ refs: [userBibleData.book + '-' + userBibleData.chapter + '-' + verse], verse: ref[2] });
  newUserBibleData.save();
}
