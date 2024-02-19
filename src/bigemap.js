//ds

import { version } from '../package.json';
import './baidu_crs';
import mustache from 'mustache';
import config from './config';
import { Map, map } from './map';
import { FeatureLayer, featureLayer } from './feature_layer';
import { TileLayer, tileLayer } from './tile_layer';
import { LegendControl, legendControl } from './legend_control';
import feedback from './feedback';
import marker from './marker';
import simplestyle from './simplestyle';
import sanitize from './sanitize';

/* css */
import './css/style.css';

const exported = {
  VERSION: version,
  config,
  Map,
  map,
  FeatureLayer,
  featureLayer,
  TileLayer,
  tileLayer,
  LegendControl,
  legendControl,
  feedback,
  marker,
  simplestyle,
  sanitize,
  template: mustache.render,

  /**
   * Gets and sets the map's access token.
   *
   * @var {string} accessToken
   * @returns {string} The currently set access token.
   * @example
   * L.bigemap.accessToken = myAccessToken;
   */
  get accessToken() {
    return config.ACCESS_TOKEN;
  },

  set accessToken(token) {
    config.ACCESS_TOKEN = token;
  },

  /**
   * Gets and sets the map's default API URL.
   *
   * @var {string} apiUrl
   * @returns {string} The current base API URL.
   * @example
   * L.bigemap.apiUrl = 'https://api.bigemap.com';
   */
  get apiUrl() {
    return config.API_URL;
  },

  set apiUrl(url) {
    config.API_URL = url;
  }
};

/**
 * Gets the version of Bigemap.js.
 *
 * @var {string} version
 * @example
 * console.log(`Bigmeap.js v${L.bigemap.VERSION}`);
 */

export default exported;
