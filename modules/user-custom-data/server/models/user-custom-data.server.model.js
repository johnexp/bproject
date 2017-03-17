'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * User Custom Data Schema
 */
var UserCustomDataSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  tags: {
    type: [String]
  },
  colorsLegend: [{
    color: {
      type: String,
      required: true,
      enum: ['yellow', 'red', 'purple', 'blue', 'green', 'pink', 'orange']
    },
    legend: {
      type: String,
      required: true,
      minlength: [2, 'O valor do campo `{PATH}` (`{VALUE}`) não atinge o valor mínimo necessário ({MAXLENGTH}).'],
      maxlength: [20, 'O valor do campo `{PATH}` (`{VALUE}`) excede o valor máximo permitido ({MAXLENGTH}).']
    }
  }]
});

mongoose.model('UserCustomData', UserCustomDataSchema);
