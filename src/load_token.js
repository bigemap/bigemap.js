'use strict';

import formatUrl from './format_url';
import request from './request';
import util from './util';
import config from './config';

export default function loadToken(callback) {
  var _ = formatUrl.token();
  request(
    _,
    function (err, json) {
      if (err) {
        util.log('could not load token at ' + _);
        return callback(err);
      } else if (json) {
        config.ACCESS_TOKEN = json.token;
        return callback(null, json.token);
      }
    }.bind(this)
  );
}
