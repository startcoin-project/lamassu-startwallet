'use strict';

var _ = require('lodash');
var Wreck = require('wreck');
var async = require('async');

exports.NAME = 'StartWallet';
exports.SUPPORTED_MODULES = ['ticker'];

var API_ENDPOINT = 'https://rates.startwallet.com/';
var pluginConfig = {};

exports.config = function config(localConfig) {
  if (localConfig) _.merge(pluginConfig, localConfig);
};


var StartWalletTicker = function(localConfig) {

};

StartWalletTicker.factory = function factory(config) {
    return new StartWalletTicker(config);
};


function getTickerUrls(currencies) {
    var urls = currencies.map(function (currency) {
        return API_ENDPOINT + 'currency/' + currency.toUpperCase();
    });
    return urls;
}

function formatResponse(currencies, results, callback) {

    var out = {};
    var tmp = null;

    function addCurrency(currency, result) {
        if (typeof result === 'undefined')
            return;
        out[currency] = {
            currency: currency,
            rates: {
                ask: result.rate,
                bid: result.rate
            }
        };
    }

    try {

        if(results.length == 1){
            results = JSON.parse(results[0]); // always only one request

        }else{

            for (var i in results) {
                var is_JSON = results[i].match(/{/g);
                if(is_JSON){
                    tmp = JSON.parse(results[i]);
                    addCurrency(tmp.code, tmp)
                }

            }
        }


    } catch (e) {


        var to_check = [];

        if(Object.keys(results).length > 1){

            for (var i in results) {
                tmp = results[i];
                var is_JSON = tmp.match(/{/g);
                if(is_JSON){
                    tmp = JSON.parse(tmp);
                    to_check[tmp.code] = tmp
                }

            }
            // is there a dody one in there?
            for (var i in currencies) {
                var currency = currencies[i];
                if(to_check[currency] === undefined ){
                    return callback(new Error('Unsupported currency invalid one in the request'));
                }
            }

        }else{
            return callback(new Error('Unsupported currency invalid json'));
        }

    }




    if (currencies.length === 1)
        addCurrency(currencies[0], results);

    else
        currencies.forEach(function(currency) {
            addCurrency(currency, results[currency]);
        });

    if (currencies.length !== Object.keys(out).length)
        return callback(new Error('Unsupported currency'));


    callback(null, out);


}

exports.ticker = function ticker(currencies, callback) {
    if (typeof currencies === 'string')
        currencies = [currencies];

    if (currencies.length === 0)
        return callback(new Error('Currency not specified'));

    var urls = getTickerUrls(currencies);

    // change each url on the list into a download job
    var downloadList = urls.map(function (url) {
        return function (cb) {
            Wreck.get(url, function (err, res, payload) {
                cb(err, payload);
            });
        };
    });

    async.parallel(downloadList, function (err, results) {
        if (err) return callback(err);

        formatResponse(currencies, results, callback);
    });
};


/*module.exports.ticker = StartWalletTicker;

module.exports.config = function config(localConfig) {
    if (localConfig) _.merge(pluginConfig, localConfig);
};*/
