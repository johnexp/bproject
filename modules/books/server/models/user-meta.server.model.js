'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * User Meta Schema
 */
var UserMetaSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  version: {
    type: String,
    lowercase: true,
    required: false
  },
  book: {
    type: String,
    lowercase: true,
    required: true,
    index: true
  },
  chapter: {
    type: Number,
    min: 1,
    max: 150,
    index: true
  },
  markers: [{
    color: {
      type: String,
      default: 'yellow',
      required: true,
      enum: ['yellow', 'blue', 'purple']
    },
    verses: [{
      type: Number,
      required: true,
      min: 1
    }]
  }],
  notes: [{
    note: {
      type: String,
      required: true,
      trim: true
    },
    verses: [{
      type: Number,
      required: true,
      min: 1
    }]
  }],
  refs: [{
    refs: [{
      type: String,
      required: true,
      trim: true,
      match: /[0-9]{0,1}[a-z\u00E0-\u00FC]{2,4}\-[0-9]{1,3}\-[0-9]{1,3}/g
    }],
    verses: [{
      type: Number,
      required: true,
      min: 1
    }]
  }],
  tags: [{
    tags: [{
      type: String,
      required: true,
      trim: true
    }],
    verses: [{
      type: Number,
      required: true,
      min: 1
    }]
  }]
});

mongoose.model('UserMeta', UserMetaSchema);