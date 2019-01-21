'use strict';

var config = require('./config'),
    version = require('../package.json').version;

module.exports = function(path, accessToken) {
    accessToken = accessToken || L.bigemap.accessToken;

    if (!accessToken && config.REQUIRE_ACCESS_TOKEN) {
        throw new Error('An API access token is required to use Bigemap.js. ' +
            'See https://www.bigemap.com/bigemap.js/api/v' + version + '/api-access-tokens/');
    }

    var url = (document.location.protocol === 'https:' || config.FORCE_HTTPS) ? config.HTTPS_URL : config.HTTP_URL;
    url = url.replace(/\/v4$/, '');
    url += path;

    if (config.REQUIRE_ACCESS_TOKEN) {
        if (accessToken[0] === 's') {
            throw new Error('Use a public access token (pk.*) with Bigemap.js, not a secret access token (sk.*). ' +
                'See https://www.bigemap.com/bigemap.js/api/v' + version + '/api-access-tokens/');
        }

        url += url.indexOf('?') !== -1 ? '&access_token=' : '?access_token=';
        url += accessToken;
    }

    return url;
};

module.exports.tileJSON = function(urlOrMapID, accessToken) {

    if (urlOrMapID.indexOf('bigemap://styles') === 0) {
        throw new Error('Styles created with Bigemap Studio need to be used with ' +
            'L.bigemap.styleLayer, not L.bigemap.tileLayer');
    }

    if (urlOrMapID.indexOf('/') !== -1)
        return urlOrMapID;

    var url = module.exports('/v4/' + urlOrMapID + '.json', accessToken);

    // TileJSON requests need a secure flag appended to their URLs so
    // that the server knows to send SSL-ified resource references.
    if (url.indexOf('https') === 0)
        url += '&secure';

    return url;
};


module.exports.style = function(styleURL, accessToken) {
    if (styleURL.indexOf('bigemap://styles/') === -1) throw new Error('Incorrectly formatted Bigemap style at ' + styleURL);

    var ownerIDStyle = styleURL.split('bigemap://styles/')[1];
    var url = module.exports('/styles/v1/' + ownerIDStyle, accessToken)
        .replace('http://', 'https://');

    return url;
};
