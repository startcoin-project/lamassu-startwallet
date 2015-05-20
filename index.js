'use strict';

var _ = require('lodash');

_.merge(exports, require('./config'));

// Ticker methods:
exports.ticker = require('./lib/ticker').ticker;
