'use strict';

var request = require('./request'),
    format_url = require('./format_url'),
    util = require('./util');

module.exports = function (callback) {
    var _ = format_url.token();
    request(_, function (err, json) {
        if (err) {
            util.log('could not load token at ' + _);
            return callback(err);
        } else if (json) {
            L.bigemap.accessToken = json.token;
            return callback(null, json.token);
        }
    }.bind(this));
};
