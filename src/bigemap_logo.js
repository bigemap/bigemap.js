import { Control, Util, DomUtil } from 'leaflet';

export const BigemapLogoControl = Control.extend({
  options: {
    position: 'bottomleft'
  },

  initialize: function (options) {
    Util.setOptions(this, options);
  },

  onAdd: function () {
    this._container = DomUtil.create('div', 'bigemap-logo');
    return this._container;
  },

  _setTileJSON: function (json) {
    // Check if account referenced by the accessToken
    // is asscociated with the Bigemap Logo
    // as determined by bigemap-maps.
    if (json.bigemap_logo) {
      this._container.classList.add('bigemap-logo-true');
    }
  }
});

export function bigemapLogoControl(options) {
  return new BigemapLogoControl(options);
}

export default bigemapLogoControl;
