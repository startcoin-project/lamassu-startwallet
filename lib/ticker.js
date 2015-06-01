'use strict';

var jsonquest = require('jsonquest');
var async = require('async');

var StartWalletTicker = function(config) {
  this.config = config;
};

StartWalletTicker.factory = function factory(config) {
  return new StartWalletTicker(config);
};

function fetchTicker(currency, cb) {
  jsonquest({
    host: 'rates.startwallet.com',
    path: '/currency/' + currency.toUpperCase(),
    method: 'GET',
    protocol: 'https'
  }, function (err, response, result) {
    if (err) return cb(err);
    var rate = null;
    try {
      rate = result.rate;
    } catch (ex) {
      return cb(new Error('Could not parse StartWallet ticker response.'));
    }
    cb(null, {currency: currency, rate: rate});
  });
}

StartWalletTicker.prototype.ticker = function ticker(currencies, cb) {
  async.map(currencies, fetchTicker, function (err, results) {
    if (err) return cb(err);
    var formattedResult = {};
    results.forEach(function (result) {
      formattedResult[result.currency] = result;
    });
    return cb(null, formattedResult);
  });
};

module.exports = StartWalletTicker;
