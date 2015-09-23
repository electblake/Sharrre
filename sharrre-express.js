var router = require('express').Router();
var request = require('request');

/**
 * Usage
 *
 * `npm install request --save`
 *
 * It's probably easiest to then copy sharrre-express.js into your
 * own express application, and then use it as middleware
 *
 * ```
 * var sharrreMiddleware = require('./path/to/sharrre-express.js');
 * app.get('/sharrre.php', sharrreMiddleware);
 * ```
 * 
 */

module.exports = function(req, res) {

    var json = {
        url: req.query.url,
        count: 0
    };

    var url = encodeURIComponent(req.query.url);
    var type = encodeURIComponent(req.query.type);

    res.header('Content-Type', 'application/json');

    // @todo valid url only
    if (url) {

        //source http://www.helmutgranda.com/2011/11/01/get-a-url-google-count-via-php/
        if (type === 'googlePlus') {
            request('https://plusone.google.com/u/0/_/+1/fastbutton?url=' + url + '&count=true', function(error, response, body) {
                var matches = body.match(/window\.__SSR = {c: ([\d]+)/);
                console.log('matches', matches);
                if (matches && matches[0]) {
                    json.count = matches[0].replace('window.__SSR = {c: ', '');
                }
                res.send(json);
            });
        } else if (type === 'stumbleupon') {
            request('http://www.stumbleupon.com/services/1.01/badge.getinfo?url='+url, function(err, response, body) {
                var result = JSON.parse(body);
                // console.log('result', result);
                if (result.result && result.result.views) {
                    json.count = result.result.views ? result.result.views : 0;
                }
                res.send(json);
            });
        }
    }
};