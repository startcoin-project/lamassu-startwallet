'use strict';

var https = require('https');

var URI = 'https://rates.startwallet.com/all';

var StartWalletTicker = function(config) {
  this.config = config;
};

StartWalletTicker.factory = function factory(config) {
  return new StartWalletTicker(config);
};

function tickerMapper(arr) {
  var results = {};
  for (var i = 0; i < arr.length; i++) {
    var rec = arr[i];
    results[rec.code] = rec.rate;
  }
  return results;
}

StartWalletTicker.prototype.ticker = function ticker(cb) {
  https.get(URI, function(res) {
    var buf = '';
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      buf += chunk;
    })
    .on('end', function() {
      var json = null;
      try {
        json = JSON.parse(buf);
      } catch(e) {
        cb(new Error('Couldn\'t parse JSON response'));
        return;
      }
      var rates = tickerMapper(json);

      cb(null, rates);
    });
  }).on('error', function(e) {
    cb(e);
  });
};

module.exports = StartWalletTicker;
