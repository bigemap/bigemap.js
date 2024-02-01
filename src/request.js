'use strict';

var xhr = require('xhr'),
    strict = require('./util').strict,
    config = require('./config');

var protocol = /^(https?:)?(?=\/\/(.|api)\.tiles\.bigemap\.com\/)/;

module.exports = function(url, callback) {
    strict(url, 'string');
    strict(callback, 'function');

    url = url.replace(protocol, function(match, protocol) {
        if (!('withCredentials' in new window.XMLHttpRequest())) {
            // XDomainRequest in use; doesn't support cross-protocol requests
            return document.location.protocol;
        } else if (protocol === 'https:' || document.location.protocol === 'https:' || config.FORCE_HTTPS) {
            return 'https:';
        } else {
            return 'http:';
        }
    });

    function onload(err, resp) {
        if (!err && resp) {
            resp = JSON.parse(resp.body);
        }
        callback(err, resp);
    }

    return xhr.get(url, onload);
};
