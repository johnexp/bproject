'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Test Schema
 */
var TestSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Test name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  modified: [{
    _id: false,
    date: {
      type: Date
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    action: {
      type: String
    }
  }],
  active: {
    type: Boolean,
    default: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Test', TestSchema);
