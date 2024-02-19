describe('format_url', function () {
  it('returns a v4 URL with access_token parameter', function () {
    expect(internals.url('/v2/user.map.json')).to.equal(
      'http://tiles.bigemap.com/v2/user.map.json?access_token=key'
    );
  });

  it('uses provided access token', function () {
    expect(internals.url('/v2/user.map.json', 'token')).to.equal(
      'http://tiles.bigemap.com/v2/user.map.json?access_token=token'
    );
  });

  it('throws an error if no access token is provided', function () {
    L.bigemap.accessToken = null;
    expect(function () {
      internals.url('/v2/user.map.json');
    }).to.throw('An API access token is required to use Bigemap.js.');
  });

  it('throws an error if a secret access token is provided', function () {
    L.bigemap.accessToken = 'sk.abc.123';
    expect(function () {
      internals.url('/v2/user.map.json');
    }).to.throw('Use a public access token (pk.*) with Bigemap.js,');
  });

  it('dedupes version out of custom set url', function () {
    internals.config.API_URL = 'https://api-maps-staging.tilestream.net';
    expect(internals.url('/v2/ludacris.map.json')).to.equal(
      'https://api-maps-staging.tilestream.net/v2/ludacris.map.json?access_token=key'
    );
    internals.config.API_URL = 'http://tiles.bigemap.com';
  });

  describe('.tileJSON', function () {
    it('returns the input when passed a URL', function () {
      expect(
        internals.url.tileJSON('http://tiles.bigemap.com/v3/user.map.json')
      ).to.equal('http://tiles.bigemap.com/v3/user.map.json');
    });

    it('returns a v4 URL with access_token parameter', function () {
      expect(internals.url.tileJSON('user.map')).to.equal(
        'http://tiles.bigemap.com/v2/user.map.json?access_token=key'
      );
    });

    it('appends &secure and uses https', function () {
      internals.config.API_URL = 'https://tiles.bigemap.com';
      expect(internals.url.tileJSON('user.map')).to.equal(
        'https://tiles.bigemap.com/v2/user.map.json?access_token=key&secure'
      );
      internals.config.API_URL = 'http://tiles.bigemap.com';
    });
  });
});
