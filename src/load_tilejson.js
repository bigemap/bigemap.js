'use strict';

var request = require('./request'),
    format_url = require('./format_url'),
    _loadToken = require('./load_token'),
    util = require('./util');

module.exports = {
    _loadTileJSON: function (_) {
        if (typeof _ === 'string') {
            _loadToken(function (err, token) {
                if (err) return this.fire('error', { error: err });
                _ = format_url.tileJSON(_, this.options && this.options.accessToken);
                request(_, L.bind(function (err, json) {
                    if (err) {
                        util.log('could not load TileJSON at ' + _);
                        this.fire('error', { error: err });
                    } else if (json) {
                        this._setTileJSON(json);
                        this.fire('ready');
                    }
                }, this));
            }.bind(this));
        } else if (_ && typeof _ === 'object') {
            this._setTileJSON(_);
        }
    }
};
