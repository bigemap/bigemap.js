describe('L.bigemap.map', function () {
  var server,
    element,
    tileJSON = helpers.tileJSON;

  beforeEach(function () {
    server = sinon.fakeServer.create();
    element = document.createElement('div');
  });

  afterEach(function () {
    server.restore();
  });

  it('allows access to the tilejson object after assignment', function () {
    var map = L.bigemap.map(element, tileJSON);
    expect(map.getTileJSON()).to.equal(tileJSON);
    expect(map instanceof L.bigemap.Map).to.eql(true);
  });

  it('passes options to constructor when called without new', function () {
    var map = L.bigemap.map(element, tileJSON, { zoomControl: false });
    expect(map.options.zoomControl).to.equal(false);
  });

  it('absorbs options form mergeOptions', function () {
    L.Map.mergeOptions({ foo: 'bar' });
    var map = L.bigemap.map(element, tileJSON, { zoomControl: false });
    expect(map.options.foo).to.equal('bar');
  });

  describe('constructor', function () {
    it('loads TileJSON from a URL', function (done) {
      var map = L.bigemap.map(
        element,
        'http://a.tiles.bigemap.com/v3/bigemap.map-0l53fhk2.json'
      );

      map.on('ready', function () {
        expect(this).to.equal(map);
        expect(map.getTileJSON()).to.eql(helpers.tileJSON);
        done();
      });

      server.respondWith(
        'GET',
        'http://a.tiles.bigemap.com/v3/bigemap.map-0l53fhk2.json',
        [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify(helpers.tileJSON)
        ]
      );
      server.respond();
    });

    it('loads TileJSON from an ID', function (done) {
      var map = L.bigemap.map(element, 'bigemap.map-0l53fhk2');

      map.on('ready', function () {
        expect(this).to.equal(map);
        expect(map.getTileJSON()).to.eql(helpers.tileJSON);
        done();
      });

      server.respondWith(
        'GET',
        'http://tiles.bigemap.com/v2/bigemap.map-0l53fhk2.json?access_token=key',
        [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify(helpers.tileJSON)
        ]
      );
      server.respond();
    });

    it('emits an error event', function (done) {
      var map = L.bigemap.map(
        element,
        'http://a.tiles.bigemap.com/v3/bigemap.map-0l53fhk2.json'
      );

      map.on('error', function (e) {
        expect(this).to.equal(map);
        expect(e.error.status).to.equal(400);
        done();
      });

      server.respondWith(
        'GET',
        'http://a.tiles.bigemap.com/v3/bigemap.map-0l53fhk2.json',
        [
          400,
          { 'Content-Type': 'application/json' },
          JSON.stringify({ error: 'error' })
        ]
      );
      server.respond();
    });

    it('can deactivate featureLayer', function () {
      var map = L.bigemap.map(
        element,
        'http://a.tiles.bigemap.com/v3/bigemap.map-0l53fhk2.json',
        {
          featureLayer: false
        }
      );
      expect(map.featureLayer).to.eql(undefined);
    });

    it('preserves manually-set view', function () {
      var map = L.bigemap
        .map(element, 'bigemap.map-0l53fhk2')
        .setView([1, 2], 3);

      server.respondWith(
        'GET',
        'http://tiles.bigemap.com/v2/bigemap.map-0l53fhk2.json?access_token=key',
        [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify(helpers.tileJSON)
        ]
      );
      server.respond();

      expect(map.getCenter()).to.eql(L.latLng(1, 2));
      expect(map.getZoom()).to.eql(3);
    });

    it('preserves manually-set zoom', function () {
      var map = L.bigemap.map(element, 'bigemap.map-0l53fhk2').setZoom(3);

      server.respondWith(
        'GET',
        'http://tiles.bigemap.com/v2/bigemap.map-0l53fhk2.json?access_token=key',
        [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify(helpers.tileJSON)
        ]
      );
      server.respond();

      expect(map.getCenter()).to.eql(L.latLng(39.386, -98.976));
      expect(map.getZoom()).to.eql(3);
    });

    it('preserves manually-set marker layer GeoJSON', function () {
      var map = L.bigemap.map(
        element,
        'http://a.tiles.bigemap.com/v3/bigemap.map-0l53fhk2.json'
      );
      map.featureLayer.setGeoJSON(helpers.geoJson);

      server.respondWith(
        'GET',
        'http://a.tiles.bigemap.com/v3/bigemap.map-0l53fhk2.json',
        [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify(helpers.tileJSON)
        ]
      );
      server.respondWith(
        'GET',
        'http://a.tiles.bigemap.com/v3/examples.map-8ced9urs/markers.geojson',
        [200, { 'Content-Type': 'application/json' }, JSON.stringify({})]
      );

      server.respond();

      expect(map.featureLayer.getGeoJSON()).to.eql(helpers.geoJson);
    });

    it('passes tileLayer options to tile layer', function () {
      var map = L.bigemap.map(element, 'bigemap.map-0l53fhk2', {
        tileLayer: { detectRetina: true }
      });
      expect(map.tileLayer.options.detectRetina).to.equal(true);
    });

    it('passes featureLayer options to feature layer', function () {
      var filter = function () {
          return true;
        },
        map = L.bigemap.map(element, 'bigemap.map-0l53fhk2', {
          featureLayer: { filter: filter }
        });
      expect(map.featureLayer.options.filter).to.equal(filter);
    });

    it('passes legendControl options to legend control', function () {
      var map = L.bigemap.map(element, 'bigemap.map-0l53fhk2', {
        legendControl: { position: 'topleft' }
      });
      expect(map.legendControl.options.position).to.equal('topleft');
    });

    it('passes custom access token option to sub-layers', function () {
      var map = L.bigemap.map(element, 'bigemap.map-0l53fhk2', {
        accessToken: 'custom'
      });
      expect(map.tileLayer.options.accessToken).to.equal('custom');
      expect(map.featureLayer.options.accessToken).to.equal('custom');
    });

    it('supports tilejson without a center property', function () {
      var map = L.bigemap.map(element, helpers.tileJSON_nocenter);
      expect(map._loaded).not.to.be.ok;
    });
  });

  describe('layers', function () {
    it('adds a tile layer immediately', function () {
      var map = L.bigemap.map(element, 'data/tilejson.json');
      expect(map.tileLayer).to.be.ok;
    });

    it('initializes the tile layer', function () {
      var map = L.bigemap.map(element, tileJSON);
      expect(map.tileLayer.getTileJSON()).to.equal(tileJSON);
    });

    it('creates no tile layer given tileLayer: false option', function () {
      var map = L.bigemap.map(element, tileJSON, { tileLayer: false });
      expect(map.tileLayer).to.be.undefined;
    });

    it('adds a maker layer immediately', function () {
      var map = L.bigemap.map(element, 'data/tilejson.json');
      expect(map.featureLayer).to.be.ok;
    });

    it('creates no marker layer given featureLayer: false option', function () {
      var map = L.bigemap.map(element, tileJSON, { featureLayer: false });
      expect(map.featureLayer).to.be.undefined;
    });
  });

  describe('controls', function () {
    it('creates a legendControl', function () {
      var map = L.bigemap.map(element, tileJSON);
      expect(map.legendControl).to.be.ok;
    });

    it('creates no legendControl given legendControl: false option', function () {
      var map = L.bigemap.map(element, tileJSON, { legendControl: false });
      expect(map.legendControl).to.be.undefined;
    });
  });

  describe('map feedback support', function () {
    function improveMapHash(map) {
      return map.getContainer().getElementsByClassName('bigemap-improve-map')[0]
        .hash;
    }

    it('adds mapid and coordinates to attribution link', function () {
      var map = L.bigemap
        .map(element, helpers.tileJSON_improvemap)
        .setView([38.902, -77.001], 13);

      expect(improveMapHash(map)).to.eql(
        '#examples.h8e9h88l/-77.001/38.902/13'
      );
    });

    it('adds mapid and coordinates to attribution link (async)', function (done) {
      var map = L.bigemap
        .map(element, 'examples.h8e9h88l')
        .setView([38.902, -77.001], 13);

      map.on('ready', function () {
        expect(improveMapHash(map)).to.eql(
          '#examples.h8e9h88l/-77.001/38.902/13'
        );
        done();
      });

      server.respondWith('GET', internals.url.tileJSON('examples.h8e9h88l'), [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify(helpers.tileJSON_improvemap)
      ]);
      server.respond();
    });

    it('adds mapid and coordinates to info link', function () {
      var map = L.bigemap
        .map(element, helpers.tileJSON_improvemap)
        .setView([38.902, -77.001], 13);

      expect(improveMapHash(map)).to.eql(
        '#examples.h8e9h88l/-77.001/38.902/13'
      );
    });

    it('updates coordinates after map is moved', function () {
      var map = L.bigemap
        .map(element, helpers.tileJSON_improvemap)
        .setView([38.902, -77.001], 13);

      map.setView([48.902, -77.001], 13);
      expect(improveMapHash(map)).to.eql(
        '#examples.h8e9h88l/-77.001/48.902/13'
      );
    });

    it('wraps coordinates', function () {
      var map = L.bigemap
        .map(element, helpers.tileJSON_improvemap)
        .setView([38.902, -77.001 - 360], 13);

      expect(improveMapHash(map)).to.eql(
        '#examples.h8e9h88l/-77.001/38.902/13'
      );
    });

    it('updates coordinates across layer adds/removes', function (done) {
      var map = L.bigemap
        .map(element, helpers.tileJSON_improvemap)
        .setView([38.902, -77.001 - 360], 13);

      var layer = L.bigemap
        .tileLayer('examples.h8e9h88l')
        .addTo(map)
        .on('ready', function () {
          expect(improveMapHash(map)).to.eql(
            '#examples.h8e9h88l/-77.001/38.902/13'
          );

          setTimeout(function () {
            map.removeLayer(layer);
            setTimeout(function () {
              expect(improveMapHash(map)).to.eql(
                '#examples.h8e9h88l/-77.001/38.902/13'
              );
              done();
            }, 5);
          }, 5);
        });

      server.respondWith('GET', internals.url.tileJSON('examples.h8e9h88l'), [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify(helpers.tileJSON_improvemap)
      ]);
      server.respond();
    });

    it('includes data from other feedback sources', function () {
      var map = L.bigemap
        .map(element, helpers.tileJSON_improvemap)
        .setView([38.902, -77.001], 13);

      L.bigemap.feedback.record({ test: '123' });

      expect(improveMapHash(map)).to.eql(
        '#examples.h8e9h88l/-77.001/38.902/13/test=123'
      );
    });
  });

  describe('corner cases', function () {
    it('re-initialization throws', function () {
      var map = L.bigemap.map(element, tileJSON);
      expect(map.tileLayer.getTileJSON()).to.equal(tileJSON);

      expect(function () {
        L.bigemap.map(element, tileJSON);
      }).to.throw('Map container is already initialized.');
    });

    it('attributionControl enabled', function (done) {
      var map = L.bigemap.map(element, 'bigemap.map-0l53fhk2', {
        attributionControl: true
      });

      map.on('ready', function () {
        expect(map.attributionControl._container.innerHTML).to.eql(
          'Data provided by NatureServe in collaboration with Robert Ridgely'
        );
        map.removeLayer(map.tileLayer);
        expect(map.attributionControl._container.innerHTML).to.eql('');
        done();
      });

      server.respondWith(
        'GET',
        internals.url.tileJSON('bigemap.map-0l53fhk2'),
        [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify(helpers.tileJSON)
        ]
      );
      server.respond();
    });
  });
});
