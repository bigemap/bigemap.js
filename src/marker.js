import formatUrl from './format_url';
import util from './util';
import { icon as Licon, Browser, marker as Lmarker } from 'leaflet';
import sanitize from './sanitize';

/**
 * A core icon generator used in `L.bigemap.marker.style`.
 *
 * @param {Object} fp A GeoJSON feature's properties object.
 * @param {Object} [options] If provided, it may include `accessToken`: Bigemap.js access token.
 * Overrides `L.bigemap.accessToken` for marker api.
 * @returns {L.Icon} A `L.Icon` object with custom settings for `iconUrl`, `iconSize`, `iconAnchor`,
 * and `popupAnchor`.
 *
 * @example
 * var icon = L.bigemap.marker.icon(properties);
 */
function icon(fp, options) {
  fp = fp || {};

  var sizes = {
      small: [20, 50],
      medium: [30, 70],
      large: [35, 90]
    },
    size = fp['marker-size'] || 'medium',
    symbol =
      'marker-symbol' in fp && fp['marker-symbol'] !== ''
        ? '-' + fp['marker-symbol']
        : '',
    color = (fp['marker-color'] || '52a1d8').replace('#', ''),
    className = fp['visibled'] === false ? 'bigemap-hidden' : '';

  return Licon({
    iconUrl: formatUrl(
      '/v2/marker/' +
        'pin-' +
        size.charAt(0) +
        symbol +
        '+' +
        color +
        // detect and use retina markers, which are x2 resolution
        (Browser.retina ? '@2x' : '') +
        '.png',
      options && options.accessToken
    ),
    iconSize: sizes[size],
    iconAnchor: [sizes[size][0] / 2, sizes[size][1] / 2],
    popupAnchor: [0, -sizes[size][1] / 2],
    className: className
  });
}

/**
 * Given a GeoJSON Feature with optional simplestyle-spec properties, return an
 * options object formatted to be used as [Leaflet Path options](http://leafletjs.com/reference.html#path).
 *
 * @param {Object} f A GeoJSON feature object.
 * @param {number[]|L.LatLng} latlon The latitude, longitude position of the marker.
 * @param {Object} [options] If provided, it may include `accessToken`: Bigemap.js access token.
 * Overrides `L.bigemap.accessToken` for marker api.
 * @returns {L.Marker} A `L.Marker` object with the latitude, longitude position and a styled marker.
 *
 * @example
 * var marker = L.bigemap.marker.style(feature, latlon);
 */
function style(f, latlon, options) {
  return Lmarker(latlon, {
    icon: icon(f.properties, options),
    title: util.strip_tags(sanitize((f.properties && f.properties.title) || ''))
  });
}

// Sanitize and format properties of a GeoJSON Feature object in order
// to form the HTML string used as the argument for `L.createPopup`
function createPopup(f, sanitizer) {
  if (!f || !f.properties) return '';
  var popup = '';

  if (f.properties.title) {
    popup += '<div class="marker-title">' + f.properties.title + '</div>';
  }

  if (f.properties.description) {
    popup +=
      '<div class="marker-description">' + f.properties.description + '</div>';
  }

  return (sanitizer || sanitize)(popup);
}

export const marker = {
  icon: icon,
  style: style,
  createPopup: createPopup
};

export default marker;
