import { Projection, Bounds, Util } from 'leaflet';

/*
 * @namespace Projection
 * @projection L.Projection.BaiduMercator
 *
 * Elliptical Mercator projection — special Mercator projection. Used by the Baidu CRS.
 */

export const BaiduMercator = Util.extend({}, Projection.Mercator, {
  R: 6378206,
  R_MINOR: 6356584.314245179,

  bounds: new Bounds(
    [20037508.342789244, -20037508.342789244],
    [-20037508.342789244, 20037508.342789244]
  )
});
