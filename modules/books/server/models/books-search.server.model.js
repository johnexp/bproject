'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * BooksSearch Schema
 */
var BooksSearchSchema = new Schema({
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
  version: {
    type: String,
    default: '',
    required: 'Please fill Bible version',
    trim: true,
    lowercase: true
  },
  numberOfChapters: {
    type: Number,
    required: 'Please fill Book number of chapters'
  },
  chapters: {
    type: [Schema.Types.Mixed]
  }
}, { collection: 'books-search' });

mongoose.model('BooksSearch', BooksSearchSchema);
