'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Book Schema
 */
var BookSchema = new Schema({
  abbrev: {
    type: String,
    default: '',
    required: 'Please fill Book abbrev',
    trim: true,
    lowercase: true
  },
  book: {
    type: String,
    default: '',
    required: 'Please fill Book name',
    trim: true,
    lowercase: true
  },
  chapters: {
    type: [Schema.Types.Mixed]
  }
});

mongoose.model('Book', BookSchema);
