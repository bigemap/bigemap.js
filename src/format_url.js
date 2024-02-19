import { version } from '../package.json';
import config from './config';

export function formatUrl(path, accessToken) {
  accessToken = accessToken || config.ACCESS_TOKEN || L.bigemap.accessToken;

  if (!accessToken && config.REQUIRE_ACCESS_TOKEN) {
    throw new Error(
      'An API access token is required to use Bigemap.js. ' +
        'See https://www.bigemap.com/bigemap.js/api/v' +
        version +
        '/api-access-tokens/'
    );
  }

  var url = config.API_URL;
  url += path;

  if (config.REQUIRE_ACCESS_TOKEN) {
    if (accessToken[0] === 's') {
      throw new Error(
        'Use a public access token (pk.*) with Bigemap.js, not a secret access token (sk.*). ' +
          'See https://www.bigemap.com/bigemap.js/api/v' +
          version +
          '/api-access-tokens/'
      );
    }

    url += url.indexOf('?') !== -1 ? '&access_token=' : '?access_token=';
    url += accessToken;
  }

  return url;
}

formatUrl.tileJSON = function (urlOrMapID, accessToken) {
  if (urlOrMapID.indexOf('/') !== -1) return urlOrMapID;

  var url = formatUrl('/v2/' + urlOrMapID + '.json', accessToken);

  // TileJSON requests need a secure flag appended to their URLs so
  // that the server knows to send SSL-ified resource references.
  if (url.indexOf('https') === 0) url += '&secure';

  return url;
};

formatUrl.token = function () {
  var url = formatUrl('/tokens/v1', 'none');
  if (url.indexOf('https') === 0) url += '&secure';

  return url;
};

export default formatUrl;
