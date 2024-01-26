'use strict';

var featureLayer = require('./feature_layer'),
    legendControl = require('./legend_control'),
    tileLayer = require('./tile_layer'),
    map = require('./map')

L.bigemap = module.exports = {
    VERSION: require('../package.json').version,
    marker: require('./marker'),
    simplestyle: require('./simplestyle'),
    tileLayer: tileLayer.tileLayer,
    TileLayer: tileLayer.TileLayer,
    legendControl: legendControl.legendControl,
    LegendControl: legendControl.LegendControl,
    featureLayer: featureLayer.featureLayer,
    FeatureLayer: featureLayer.FeatureLayer,
    map: map.map,
    Map: map.Map,
    config: require('./config'),
    sanitize: require('sanitize-caja'),
    template: require('mustache').to_html,
    feedback: require('./feedback')
};


// Hardcode image path, because Leaflet's autodetection
// fails, because bigemap.js is not named leaflet.js
// window.L.Icon.Default.imagePath =
//     // Detect bad-news protocols like file:// and hardcode
//     // to https if they're detected.
//     ((document.location.protocol === 'https:' ||
//     document.location.protocol === 'http:') ? '' : 'https:') +
//     '//api.tiles.bigemap.com/bigemap.js/' + 'v' +
//     require('../package.json').version + '/images/';
