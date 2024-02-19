import formatUrl from './format_url';
import marker from './marker';
import request from './request';
import simplestyle from './simplestyle';
import util from './util';
import { FeatureGroup, Util, GeoJSON, Circle, CircleMarker } from 'leaflet';
import sanitize from './sanitize';

/**
 * `L.bigemap.featureLayer` provides an easy way to integrate [GeoJSON](http://www.geojson.org/)
 * from Bigemap and elsewhere into your map.
 * 
 * @extends L.FeatureGroup
 * @param {string|Object} id Must be either:
 * 
 * * An `id` string like `examples.map-foo`.
 * * A GeoJSON object, from your own Javascript code.
 * 
 * @param {Object} [options] If provided, it is the same options as provided to [`L.FeatureGroup`](https://leafletjs.com/reference.html#featureGroup),
 * with the following addition:
 * 
 * * `accessToken`: Bigemap Server API access token. Overrides `L.bigemap.accessToken` for this layer.
 * 
 * @returns {FeatureLayer} A `L.bigemap.featureLayer` object.
 * 
 * @example
 * var featureLayer = L.bigemap.featureLayer(geojson).addTo(map);
 */
export const FeatureLayer = FeatureGroup.extend({
  options: {
    filter: function () {
      return true;
    },
    sanitizer: sanitize,
    style: simplestyle.style,
    popupOptions: { closeButton: false }
  },

  initialize: function (_, options) {
    Util.setOptions(this, options);

    this._layers = {};

    if (typeof _ === 'string') {
      util.idUrl(_, this);
      // javascript object of TileJSON data
    } else if (_ && typeof _ === 'object') {
      this.setGeoJSON(_);
    }
  },

  setGeoJSON: function (_) {
    this._geojson = _;
    this.clearLayers();
    this._initialize(_);
    return this;
  },

  getGeoJSON: function () {
    return this._geojson;
  },

  loadURL: function (url) {
    if (this._request && 'abort' in this._request) this._request.abort();
    this._request = request(
      url,
      function (err, json) {
        this._request = null;
        if (err && err.type !== 'abort') {
          util.log('could not load features at ' + url);
          this.fire('error', { error: err });
        } else if (json) {
          this.setGeoJSON(json);
          this.fire('ready');
        }
      }.bind(this)
    );
    return this;
  },

  loadID: function (id) {
    return this.loadURL(
      formatUrl('/v2/' + id + '/features.json', this.options.accessToken)
    );
  },

  setFilter: function (_) {
    this.options.filter = _;
    if (this._geojson) {
      this.clearLayers();
      this._initialize(this._geojson);
    }
    return this;
  },

  getFilter: function () {
    return this.options.filter;
  },

  _initialize: function (json) {
    var features = Array.isArray(json) ? json : json.features,
      i,
      len;

    if (features) {
      for (i = 0, len = features.length; i < len; i++) {
        // Only add this if geometry or geometries are set and not null
        if (
          features[i].geometries ||
          features[i].geometry ||
          features[i].features
        ) {
          this._initialize(features[i]);
        }
      }
    } else if (this.options.filter(json)) {
      var opts = { accessToken: this.options.accessToken },
        pointToLayer =
          this.options.pointToLayer ||
          function (feature, latlon) {
            return marker.style(feature, latlon, opts);
          },
        layer = GeoJSON.geometryToLayer(json, {
          pointToLayer: pointToLayer
        }),
        popupHtml = marker.createPopup(json, this.options.sanitizer),
        style = this.options.style,
        defaultStyle = style === simplestyle.style;

      if (
        style &&
        'setStyle' in layer &&
        // if the style method is the simplestyle default, then
        // never style Circle or CircleMarker because
        // simplestyle has no rules over them, only over geometry
        // primitives directly from GeoJSON
        !(
          defaultStyle &&
          (layer instanceof Circle || layer instanceof CircleMarker)
        )
      ) {
        if (typeof style === 'function') {
          style = style(json);
        }
        layer.setStyle(style);
      }

      layer.feature = json;

      if (popupHtml) {
        layer.bindPopup(popupHtml, this.options.popupOptions);
      }

      this.addLayer(layer);
    }
  }
});

export function featureLayer(_, options) {
  return new FeatureLayer(_, options);
}

export default featureLayer;
