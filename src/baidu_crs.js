import { BaiduMercator } from './baidu_mercator_projection';
import { CRS, transformation, Util } from 'leaflet';

/*
 * @namespace CRS
 * @crs L.CRS.Baidu
 *
 * The CRS for Baidu map.
 */

export const Baidu = Util.extend({}, CRS.Earth, {
  code: 'baidu',
  wrapLng: undefined,
  projection: BaiduMercator,
  transformation: transformation(1, 0, -1, 0),
  _scales: (function () {
    const scales = [];
    for (let i = 20; i >= 0; i--) {
      scales[i] = 1 / Math.pow(2, 18 - i);
    }
    return scales;
  })(),

  scale(zoom) {
    const iZoom = Math.floor(zoom);
    let baseScale, nextScale, scaleDiff, zDiff;
    if (zoom === iZoom) {
      return this._scales[zoom];
    } else {
      // Non-integer zoom, interpolate
      baseScale = this._scales[iZoom];
      nextScale = this._scales[iZoom + 1];
      scaleDiff = nextScale - baseScale;
      zDiff = zoom - iZoom;
      return baseScale + scaleDiff * zDiff;
    }
  },

  zoom(scale) {
    // Find closest number in this._scales, down
    const downScale = this._closestElement(this._scales, scale),
      downZoom = this._scales.indexOf(downScale);
    // Check if scale is downScale => return array index
    if (scale === downScale) {
      return downZoom;
    }
    if (downScale === undefined) {
      return -Infinity;
    }
    // Interpolate
    const nextZoom = downZoom + 1;
    const nextScale = this._scales[nextZoom];
    if (nextScale === undefined) {
      return Infinity;
    }
    const scaleDiff = nextScale - downScale;
    return (scale - downScale) / scaleDiff + downZoom;
  },

  /* Get the closest lowest element in an array */
  _closestElement(array, element) {
    let low;
    for (let i = array.length; i--; ) {
      if (array[i] <= element && (low === undefined || low < array[i])) {
        low = array[i];
      }
    }
    return low;
  }
});

CRS.Baidu = Baidu;
