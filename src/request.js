import config from './config';
import util from './util';
import xhr from 'xhr';

var protocol = /^(https?:)?(?=\/\/(.|api)\.tiles\.bigemap\.com\/)/;

export function request(url, callback) {
  util.strict(url, 'string');
  util.strict(callback, 'function');

  url = url.replace(protocol, function (match, protocol) {
    if (!('withCredentials' in new window.XMLHttpRequest())) {
      // XDomainRequest in use; doesn't support cross-protocol requests
      return document.location.protocol;
    } else if (
      protocol === 'https:' ||
      document.location.protocol === 'https:' ||
      config.FORCE_HTTPS
    ) {
      return 'https:';
    } else {
      return 'http:';
    }
  });

  function isSuccessful(status) {
    return (status >= 200 && status < 300) || status === 304;
  }

  function onload(err, resp) {
    if (!err && resp) {
      const raw = resp.rawRequest;
      if (isSuccessful(raw.status)) resp = JSON.parse(resp.body);
      else return callback(raw, null);
    }
    callback(err, resp);
  }

  return xhr.get(url, onload);
}

export default request;
