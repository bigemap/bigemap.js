'use strict';

var BigemapLogoControl = L.Control.extend({

    options: {
        position: 'bottomleft'
    },

    initialize: function(options) {
        L.setOptions(this, options);
    },

    onAdd: function() {
        this._container = L.DomUtil.create('div', 'bigemap-logo');
        return this._container;
    },

    _setTileJSON: function(json) {
        // Check if account referenced by the accessToken
        // is asscociated with the Bigemap Logo
        // as determined by bigemap-maps.
        if (json.bigemap_logo) {
            L.DomUtil.addClass(this._container, 'bigemap-logo-true');
        }
    }
});

module.exports.BigemapLogoControl = BigemapLogoControl;

module.exports.bigemapLogoControl = function(options) {
    return new BigemapLogoControl(options);
};
