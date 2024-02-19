'use strict';

import bigemapLogoControl from './bigemap_logo';
import featureLayer from './feature_layer';
import feedback from './feedback';
import legendControl from './legend_control';
import loadTileJson from './load_tilejson';
import tileLayer from './tile_layer';
import { Map as LMap, Util, latLng } from 'leaflet';
import sanitize from './sanitize';

function withAccessToken(options, accessToken) {
  if (!accessToken || options.accessToken) return options;
  return Util.extend({ accessToken: accessToken }, options);
}

/**
 * Create and automatically configure a map with layers, markers, and 
 * interactivity.
 * 
 * @augments L.Map
 * @param {HTMLElement|string} element The HTML element in which Bigemap.js will render the map, or the element's string `id`. The specified element must have no children.
 * @param {string|Object} id The map's `id` string `examples.map-foo`.
 * @param {Object} [options] If provided, it is the same [options](https://leafletjs.com/reference.html#map-option) as provided to L.Map with the following additions:
 * 
 * * `tileLayer` L.TileLayer option. Options passed to a `L.bigemap.tileLayer` based on the TileJSON. Set to `false` to disable the `L.bigemap.tileLayer`.
 * * `featureLayer` `L.bigemap.featureLayer` options. Options passed to a `L.bigemap.featureLayer` based on the TileJSON. Set to `false` to disable the `L.bigemap.featureLayer`.
 * * `legendControl` `L.bigemap.legendControl` options. Options passed to a `L.bigemap.legendControl` based on the TileJSON. Set to `false` to disable the `L.bigemap.legendControl`.
 * 
 * @example
 * // map refers to a <div> element with the ID map
 * // bigemap.streets is the ID of a map on Bigemap.com
 * var map = L.bigemap.map('map', 'bigemap.streets');
 * 
 * @example
 * // This map will have no layers initially
 * var map = L.bigemap.map('map');
 */
export const Map = LMap.extend({
  includes: [loadTileJson],

  options: {
    tileLayer: {},
    featureLayer: {},
    legendControl: {},
    shareControl: false,
    sanitizer: sanitize
  },

  _tilejson: {},

  initialize: function (element, _, options) {
    LMap.prototype.initialize.call(
      this,
      element,
      Util.extend({}, LMap.prototype.options, options)
    );

    // Disable the default 'Leaflet' text
    if (this.attributionControl) {
      this.attributionControl.setPrefix('');

      var compact = this.options.attributionControl.compact;
      // Set a compact display if map container width is < 640 or
      // compact is set to `true` in attributionControl options.
      if (
        compact ||
        (compact !== false && this._container.offsetWidth <= 640)
      ) {
        this.attributionControl._container.classList.add(
          'leaflet-compact-attribution'
        );
      }

      if (compact === undefined) {
        this.on('resize', function () {
          if (this._container.offsetWidth > 640) {
            this.attributionControl._container.classList.remove(
              'leaflet-compact-attribution'
            );
          } else {
            this.attributionControl._container.classList.add(
              'leaflet-compact-attribution'
            );
          }
        });
      }
    }

    if (this.options.tileLayer) {
      this.tileLayer = tileLayer(
        undefined,
        withAccessToken(this.options.tileLayer, this.options.accessToken)
      );
      this.addLayer(this.tileLayer);
    }

    if (this.options.featureLayer) {
      this.featureLayer = featureLayer(
        undefined,
        withAccessToken(this.options.featureLayer, this.options.accessToken)
      );
      this.addLayer(this.featureLayer);
    }

    if (this.options.legendControl) {
      this.legendControl = legendControl(this.options.legendControl);
      this.addControl(this.legendControl);
    }

    this._bigemapLogoControl = bigemapLogoControl(
      this.options.bigemapLogoControl
    );
    this.addControl(this._bigemapLogoControl);

    this._loadTileJSON(_);

    this.on('layeradd', this._onLayerAdd, this)
      .on('layerremove', this._onLayerRemove, this)
      .on('moveend', this._updateMapFeedbackLink, this);

    this.whenReady(function () {
      feedback.on('change', this._updateMapFeedbackLink, this);
    });

    this.on('unload', function () {
      feedback.off('change', this._updateMapFeedbackLink, this);
    });
  },

  // use a javascript object of tilejson data to configure this layer
  _setTileJSON: function (_) {
    this._tilejson = _;
    this._initialize(_);
    return this;
  },

  getTileJSON: function () {
    return this._tilejson;
  },

  _initialize: function (json) {
    if (this.tileLayer) {
      this.tileLayer._setTileJSON(json);
      this._updateLayer(this.tileLayer);
    }

    if (
      this.featureLayer &&
      !this.featureLayer.getGeoJSON() &&
      json.data &&
      json.data[0]
    ) {
      this.featureLayer.loadURL(json.data[0]);
    }

    if (this.legendControl && json.legend) {
      this.legendControl.addLegend(json.legend);
    }

    if (this.shareControl) {
      this.shareControl._setTileJSON(json);
    }

    this._bigemapLogoControl._setTileJSON(json);

    if (!this._loaded && json.center) {
      var zoom = this.getZoom() !== undefined ? this.getZoom() : json.center[2],
        center = latLng(json.center[1], json.center[0]);

      this.setView(center, zoom);
    }
  },

  _updateMapFeedbackLink: function () {
    if (!this._controlContainer.getElementsByClassName) return;
    var link = this._controlContainer.getElementsByClassName(
      'bigemap-improve-map'
    );
    if (link.length && this._loaded) {
      var center = this.getCenter().wrap();
      var tilejson = this._tilejson || {};
      var id = tilejson.id || '';

      var hash =
        '#' +
        id +
        '/' +
        center.lng.toFixed(3) +
        '/' +
        center.lat.toFixed(3) +
        '/' +
        this.getZoom();

      for (var key in feedback.data) {
        hash += '/' + key + '=' + feedback.data[key];
      }

      for (var i = 0; i < link.length; i++) {
        link[i].hash = hash;
      }
    }
  },

  _onLayerAdd: function (e) {
    if ('on' in e.layer) {
      e.layer.on('ready', this._onLayerReady, this);
    }
    window.setTimeout(this._updateMapFeedbackLink.bind(this), 0); // Update after attribution control resets the HTML.
  },

  _onLayerRemove: function (e) {
    if ('on' in e.layer) {
      e.layer.off('ready', this._onLayerReady, this);
    }
    window.setTimeout(this._updateMapFeedbackLink.bind(this), 0); // Update after attribution control resets the HTML.
  },

  _onLayerReady: function (e) {
    this._updateLayer(e.target);
  },

  _updateLayer: function (layer) {
    if (!layer.options) return;

    if (this.attributionControl && this._loaded && layer.getAttribution) {
      this.attributionControl.addAttribution(layer.getAttribution());
    }

    if (
      !(Util.stamp(layer) in this._zoomBoundLayers) &&
      (layer.options.maxZoom || layer.options.minZoom)
    ) {
      this._zoomBoundLayers[Util.stamp(layer)] = layer;
    }

    this._updateMapFeedbackLink();
    this._updateZoomLevels();
  }
});

export function map(element, _, options) {
  return new Map(element, _, options);
}

export default map;
