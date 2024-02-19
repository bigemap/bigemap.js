describe('bigemap_logo', function () {
  var server,
    element,
    doc,
    tileJSON = helpers.tileJSON;

  beforeEach(function () {
    server = sinon.fakeServer.create();
    element = document.createElement('div');
  });

  afterEach(function () {
    server.restore();
  });

  it('constructor', function () {
    var map = L.bigemap.map(element, tileJSON);
    var bigemapLogoControl = map._bigemapLogoControl.getContainer();
    expect(map._bigemapLogoControl instanceof L.Control);
  });

  it('is not on tilejson map without bigemap_logo flag', function () {
    var map = L.bigemap.map(element, tileJSON);
    var bigemapLogoControl = map._bigemapLogoControl.getContainer();
    expect(bigemapLogoControl.classList.contains('bigemap-logo-true')).to.be
      .false;
  });

  it('is on tilejson map with bigemap_logo === true', function () {
    var map = L.bigemap.map(element, helpers.tileJSON_bigemaplogo);
    var bigemapLogoControl = map._bigemapLogoControl.getContainer();
    expect(bigemapLogoControl.classList.contains('bigemap-logo-true')).to.be
      .true;
  });

  it('is not on tilejson map with bigemap_logo === false', function () {
    var map = L.bigemap.map(element, helpers.tileJSON_bigemaplogoFalse);
    var bigemapLogoControl = map._bigemapLogoControl.getContainer();
    expect(bigemapLogoControl.classList.contains('bigemap-logo-true')).to.be
      .false;
  });

  it('is on mapid map with bigemap_logo flag === true', function (done) {
    var map = L.bigemap.map(element, 'bigemap.map-0l53fhk2');
    map.on('ready', function () {
      var bigemapLogoControl = map._bigemapLogoControl.getContainer();
      expect(bigemapLogoControl.classList.contains('bigemap-logo-true')).to.be
        .true;
      done();
    });

    server.respondWith(
      'GET',
      'http://tiles.bigemap.com/v2/bigemap.map-0l53fhk2.json?access_token=key',
      [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify(helpers.tileJSON_bigemaplogo)
      ]
    );
    server.respond();
  });

  it('is not on mapid map with bigemap_logo flag === false', function (done) {
    var map = L.bigemap.map(element, 'bigemap.map-0l53fhk2');
    map.on('ready', function () {
      var bigemapLogoControl = map._bigemapLogoControl.getContainer();
      expect(bigemapLogoControl.classList.contains('bigemap-logo-true')).to.be
        .false;
      done();
    });

    server.respondWith(
      'GET',
      'http://tiles.bigemap.com/v2/bigemap.map-0l53fhk2.json?access_token=key',
      [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify(helpers.tileJSON_bigemaplogoFalse)
      ]
    );
    server.respond();
  });
});
