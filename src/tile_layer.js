import loadTileJson from './load_tilejson';
import util from './util';
import { TileLayer as LTileLayer, Util, Browser } from 'leaflet';
import sanitize from './sanitize';

var formatPattern = /\.((?:png|jpg)\d*)(?=$|\?)/;

/**
 * You can add a tiled layer to your map with `L.bigemap.tileLayer()`, a simple
 * interface to layers from Bigemap and elsewhere.
 * 
 * @extends L.TileLayer
 * @param {string|Object} id An `id` string like `examples.map-foo`.
 * @param {Object} [options] If provided, it is the same options as provided to [`L.TileLayer`](https://leafletjs.com/reference.html#tilelayer),
 * with the following addition:
 * 
 * * `accessToken`: Bigemap Server API access token. Overrides `L.bigemap.accessToken` for this layer.
 * 
 * @example
 * // the second argument is optional
 * var layer = L.bigemap.tileLayer('bigemap.streets');
 */
export const TileLayer = LTileLayer.extend({
  includes: [loadTileJson],

  options: {
    sanitizer: sanitize
  },

  formats: [
    'png',
    'jpg',
    // PNG
    'png32',
    'png64',
    'png128',
    'png256',
    // JPG
    'jpg70',
    'jpg80',
    'jpg90'
  ],

  initialize: function (_, options) {
    LTileLayer.prototype.initialize.call(this, undefined, options);

    this._tilejson = {};

    if (options && options.format) {
      util.strict_oneof(options.format, this.formats);
    }

    this._loadTileJSON(_);
  },

  setFormat: function (_) {
    util.strict(_, 'string');
    this.options.format = _;
    this.redraw();
    return this;
  },

  // disable the setUrl function, which is not available on bigemap tilelayers
  setUrl: null,

  _setTileJSON: function (json) {
    util.strict(json, 'object');

    if (!this.options.format) {
      var match = json.tiles[0].match(formatPattern);
      if (match) {
        this.options.format = match[1];
      }
    }

    if (json.zoomoffset) {
      json.zoomOffset = json.zoomoffset;
      delete json.zoomoffset;
    }
    json.zoomOffset = json.zoomOffset || 0;

    Util.extend(this.options, {
      tiles: json.tiles,
      attribution: this.options.sanitizer(json.attribution),
      minZoom: (json.minzoom || 0) - json.zoomOffset,
      maxZoom: (json.maxzoom || 18) - json.zoomOffset,
      tms: json.scheme === 'tms',
      bounds: json.bounds && util.lbounds(json.bounds),
      zoomOffset: json.zoomOffset ? json.zoomOffset : 0
    });

    this._tilejson = json;
    this.redraw();
    return this;
  },

  getTileJSON: function () {
    return this._tilejson;
  },

  // this is an exception to bigemap.js naming rules because it's called
  // by `L.map`
  getTileUrl: function (coords) {
    var tiles = this.options.tiles,
      index = Math.floor(Math.abs(coords.x + coords.y) % tiles.length),
      url = tiles[index];

    const data = {
      r: Browser.retina ? '@2x' : '',
      x: coords.x,
      y: coords.y,
      z: this._getZoomForUrl() || coords.z
    };

    if (this._map && !this._map.options.crs.infinite) {
      const invertedY =
        this._globalTileRange.max.y - coords.y + this._globalTileRange.min.y;
      if (this.options.tms) {
        data['y'] = invertedY;
      }
      data['-y'] = invertedY;
    }

    var templated = Util.template(url, Util.extend(data, this.options));

    if (!this.options.format) return templated;
    return templated.replace(formatPattern, '.' + this.options.format);
  },

  // TileJSON.TileLayers are added to the map immediately, so that they get
  // the desired z-index, but do not update until the TileJSON has been loaded.
  _update: function () {
    if (this.options.tiles) {
      LTileLayer.prototype._update.call(this);
    }
  }
});

export function tileLayer(_, options) {
  return new TileLayer(_, options);
}

export default tileLayer;
