'use strict';

var _ = require('lodash');

exports.NAME = 'StartWallet';
exports.SUPPORTED_MODULES = ['ticker'];
exports.API_ENDPOINT = 'https://rates.startwallet.com';

exports.SATOSHI_FACTOR = 1e8;
exports.FUDGE_FACTOR = 1.05;

exports.config = function config(localConfig) {
  if (localConfig) _.merge(exports, localConfig);
};