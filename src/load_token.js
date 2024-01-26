'use strict';

var request = require('./request'),
    format_url = require('./format_url'),
    util = require('./util');

module.exports = {
    _loadToken: function (callback) {
        var _ = format_url.token();
        request(_, L.bind(function (err, json) {
            if (err) {
                util.log('could not load token at ' + _);
                return callback(err);
            } else if (json) {
                L.bigemap.accessToken = json.token;
                return callback(null, json.token);
            }
        }, this));
    }
};
