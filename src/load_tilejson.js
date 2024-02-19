'use strict';

import formatUrl from './format_url';
import request from './request';
import util from './util';

export const loadTileJson = {
  _loadTileJSON: function (_) {
    if (typeof _ === 'string') {
      _ = formatUrl.tileJSON(_, this.options && this.options.accessToken);
      request(
        _,
        function (err, json) {
          if (err) {
            util.log('could not load TileJSON at ' + _);
            this.fire('error', { error: err });
          } else if (json) {
            this._setTileJSON(json);
            this.fire('ready');
          }
        }.bind(this)
      );
    } else if (_ && typeof _ === 'object') {
      this._setTileJSON(_);
    }
  }
};

export default loadTileJson;
