import { Control, Util, DomUtil, DomEvent } from 'leaflet';
import sanitize from './sanitize';

/**
 * A map control that shows legends added to maps in Bigemap. Legends are auto-detected from active layers.
 * 
 * @extends L.Control
 * @param {Object} [options] If provided, it is the same options as provided to [`L.Control`](https://leafletjs.com/reference.html#control).
 * @constructor L.bigemap.legendControl()
 * @example
 * var map = L.bigemap.map('map').setView([38, -77], 5);
 * map.addControl(L.bigemap.legendControl());
 */
export const LegendControl = Control.extend({
  options: {
    position: 'bottomright',
    sanitizer: sanitize
  },

  initialize: function (options) {
    Util.setOptions(this, options);
    this._legends = {};
  },

  onAdd: function () {
    this._container = DomUtil.create('div', 'map-legends wax-legends');
    DomEvent.disableClickPropagation(this._container);

    this._update();

    return this._container;
  },

  addLegend: function (text) {
    if (!text) {
      return this;
    }

    if (!this._legends[text]) {
      this._legends[text] = 0;
    }

    this._legends[text]++;
    return this._update();
  },

  removeLegend: function (text) {
    if (!text) {
      return this;
    }
    if (this._legends[text]) this._legends[text]--;
    return this._update();
  },

  _update: function () {
    if (!this._map) {
      return this;
    }

    this._container.innerHTML = '';
    var hide = 'none';

    for (var i in this._legends) {
      if (this._legends[i]) {
        var div = DomUtil.create(
          'div',
          'map-legend wax-legend',
          this._container
        );
        div.innerHTML = this.options.sanitizer(i);
        hide = 'block';
      }
    }

    // hide the control entirely unless there is at least one legend;
    // otherwise there will be a small grey blemish on the map.
    this._container.style.display = hide;

    return this;
  }
});

export function legendControl(options) {
  return new LegendControl(options);
}

export default legendControl;
