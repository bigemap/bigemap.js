var helpers = {};
beforeEach(function () {
  L.bigemap.accessToken = 'key';
});

(window || global).XMLHttpRequest = sinon.useFakeXMLHttpRequest();

// permissive test of leaflet-like location objects
chai.util.addMethod(chai.Assertion.prototype, 'near', function (expected, delta) {
  if (this._obj.lat !== undefined) {
    expect(this._obj.lat).to.be.within(
      expected.lat - delta,
      expected.lat + delta
    );
    expect(this._obj.lng).to.be.within(
      expected.lng - delta,
      expected.lng + delta
    );
  } else {
    expect(this._obj[0]).to.be.within(
      expected.lat - delta,
      expected.lat + delta
    );
    expect(this._obj[1]).to.be.within(
      expected.lng - delta,
      expected.lng + delta
    );
  }
});

helpers.tileJSON = {
  attribution:
    'Data provided by NatureServe in collaboration with Robert Ridgely',
  bounds: [-180, -85.0511, 180, 85.0511],
  center: [-98.976, 39.386, 4],
  //   data: [
  //     'http://a.tiles.bigemap.com/v3/examples.map-8ced9urs/markers.geojsonp'
  //   ],
  description: 'Bird species of North America, gridded by species count.',
  geocoder:
    'http://a.tiles.bigemap.com/v3/examples.map-8ced9urs/geocode/{query}.jsonp',
  grids: [
    'http://a.tiles.bigemap.com/v3/examples.map-8ced9urs/{z}/{x}/{y}.grid.json',
    'http://b.tiles.bigemap.com/v3/examples.map-8ced9urs/{z}/{x}/{y}.grid.json',
    'http://c.tiles.bigemap.com/v3/examples.map-8ced9urs/{z}/{x}/{y}.grid.json',
    'http://d.tiles.bigemap.com/v3/examples.map-8ced9urs/{z}/{x}/{y}.grid.json'
  ],
  id: 'examples.map-8ced9urs',
  maxzoom: 17,
  minzoom: 0,
  name: 'Bird species',
  private: true,
  scheme: 'xyz',
  template:
    "{{#__l0__}}{{#__location__}}{{/__location__}}{{#__teaser__}}<div class='birds-tooltip'>\n  <strong>{{name}}</strong>\n  <strong>{{count}} species</strong>\n  <small>{{species}}</small>\n  <div class='carmen-fields' style='display:none'>\n  {{search}} {{lon}} {{lat}} {{bounds}}\n  </div>\n</div>\n<style type='text/css'>\n.birds-tooltip strong { display:block; font-size:16px; }\n.birds-tooltip small { font-size:10px; display:block; overflow:hidden; max-height:90px; line-height:15px; }\n</style>{{/__teaser__}}{{#__full__}}{{/__full__}}{{/__l0__}}",
  tilejson: '2.0.0',
  tiles: [
    'http://a.tiles.bigemap.com/v3/examples.map-8ced9urs/{z}/{x}/{y}.png',
    'http://b.tiles.bigemap.com/v3/examples.map-8ced9urs/{z}/{x}/{y}.png',
    'http://c.tiles.bigemap.com/v3/examples.map-8ced9urs/{z}/{x}/{y}.png',
    'http://d.tiles.bigemap.com/v3/examples.map-8ced9urs/{z}/{x}/{y}.png'
  ],
  webpage: 'http://tiles.bigemap.com/examples/map/map-8ced9urs'
};

helpers.tileJSON_improvemap = {
  attribution:
    "<a href='https://www.bigemap.com/about/maps/' target='_blank'>&copy; Bigemap &copy; OpenStreetMap</a> <a class='bigemap-improve-map' href='https://www.bigemap.com/feedback/' target='_blank'>Improve this map</a>",
  autoscale: true,
  bounds: [-180, -85.0511, 180, 85.0511],
  center: [0, 0, 3],
  //data: ['http://a.tiles.bigemap.com/v3/examples.h8e9h88l/markers.geojsonp'],
  geocoder:
    'http://a.tiles.bigemap.com/v3/examples.h8e9h88l/geocode/{query}.jsonp',
  id: 'examples.h8e9h88l',
  maxzoom: 22,
  minzoom: 0,
  name: 'My Bigemap Streets Map',
  private: true,
  scheme: 'xyz',
  tilejson: '2.0.0',
  tiles: ['http://a.tiles.bigemap.com/v3/examples.h8e9h88l/{z}/{x}/{y}.png'],
  webpage: 'http://a.tiles.bigemap.com/v3/examples.h8e9h88l/page.html'
};

helpers.tileJSON_street_terrain = {
  attribution:
    '<a href="https://www.bigemap.com/about/maps/" target="_blank">&copy; Bigemap</a> <a href="http://www.openstreetmap.org/about/" target="_blank">&copy; OpenStreetMap</a> <a class="bigemap-improve-map" href="https://www.bigemap.com/feedback/" target="_blank">Improve this map</a>',
  bounds: [-180, -85.0511, 180, 85.0511],
  center: [0, 0, 0],
  format: 'pbf',
  maxzoom: 15,
  minzoom: 0,
  name: 'Bigemap Streets V6 + Vector Terrain V2',
  scheme: 'xyz',
  tilejson: '2.0.0',
  tiles: [
    'http://a.tiles.bigemap.com/v4/bigemap.bigemap-terrain-v2,bigemap.bigemap-streets-v6/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejh2N21nMzAxMmQzMnA5emRyN2lucW0ifQ.jSE-g2vsn48Ry928pqylcg',
    'http://b.tiles.bigemap.com/v4/bigemap.bigemap-terrain-v2,bigemap.bigemap-streets-v6/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejh2N21nMzAxMmQzMnA5emRyN2lucW0ifQ.jSE-g2vsn48Ry928pqylcg'
  ],
  vector_layers: [
    {
      description: 'Generalized landcover classification',
      fields: {
        class: 'One of: wood, scrub, grass, crop, snow'
      },
      id: 'landcover',
      maxzoom: 22,
      minzoom: 0,
      source: 'bigemap.bigemap-terrain-v2'
    },
    {
      description: '',
      fields: {
        class: 'One of: shadow, highlight',
        level: 'Brightness %. One of: 94, 90, 89, 78, 67, 56'
      },
      id: 'hillshade',
      maxzoom: 22,
      minzoom: 0,
      source: 'bigemap.bigemap-terrain-v2'
    },
    {
      description: 'Elevation contour polygons',
      fields: {
        ele: 'Integer. The elevation of the contour in meters',
        index:
          'Indicator for every 2nd, 5th, or 10th contour. Coastlines are given -1. One of: 2, 5, 10, -1, null'
      },
      id: 'contour',
      maxzoom: 22,
      minzoom: 0,
      source: 'bigemap.bigemap-terrain-v2'
    },
    {
      description: '',
      fields: {
        class:
          'One of: park, cemetery, hospital, school, industrial, parking, pitch, piste, agriculture, wood, scrub, grass, sand, rock, glacier',
        osm_id: 'Unique OSM ID number',
        type: 'OSM tag, more specific than class'
      },
      id: 'landuse',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        class:
          'One of: river, canal, stream, stream_intermittent, ditch, drain',
        osm_id: 'Unique OSM ID number',
        type: 'One of: river, canal, stream, ditch, drain'
      },
      id: 'waterway',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        osm_id: 'Unique OSM ID number'
      },
      id: 'water',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        osm_id: 'Unique OSM ID number',
        type: 'One of: runway, taxiway, apron'
      },
      id: 'aeroway',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        class: 'One of: fence, hedge, cliff, gate, land',
        osm_id: 'Unique OSM ID number'
      },
      id: 'barrier_line',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        osm_id: 'Unique OSM ID number'
      },
      id: 'building',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        class: 'One of: wetland, wetland_noveg',
        osm_id: 'Unique OSM ID number'
      },
      id: 'landuse_overlay',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        class:
          'One of: motorway, motorway_link, main, street, street_limited, service, driveway, path, major_rail, minor_rail',
        layer:
          'Number used for ordering overlapping tunnels. May be any integer, but most common values are -1 to -5',
        oneway: 'Number. Oneway roads are 1, all others are 0',
        osm_id: 'Unique OSM ID number',
        type: "The value of the tunnel's highway tag"
      },
      id: 'tunnel',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        class:
          'One of: motorway, motorway_link, main, street, street_limited, service, driveway, path, major_rail, minor_rail',
        oneway: 'Number. Oneway roads are 1, all others are 0',
        osm_id: 'Unique OSM ID number',
        type: "The value of the road's highway tag"
      },
      id: 'road',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        class:
          'One of: motorway, motorway_link, main, street, street_limited, service, driveway, path, major_rail, minor_rail, aerialway',
        layer:
          'Number used for ordering overlapping bridges. May be any integer, but most common values are 1 to 5',
        oneway: 'Number. Oneway bridges are 1, all others are 0',
        osm_id: 'Unique OSM ID number',
        type: "The value of the bridge's highway tag"
      },
      id: 'bridge',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        admin_level:
          'The OSM administrative level of the boundary. One of: 2, 3, 4',
        disputed: 'Number. Disputed boundaries are 1, all others are 0',
        maritime: 'Number. Maritime boundaries are 1, all others are 0'
      },
      id: 'admin',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        code: 'ISO 3166-1 Alpha-2 code',
        name: 'Local name of the country',
        name_de: 'German name of the country',
        name_en: 'English name of the country',
        name_es: 'Spanish name of the country',
        name_fr: 'French name of the country',
        name_ru: 'Russian name of the country',
        name_zh: 'Chinese name of the country',
        osm_id: 'Unique OSM ID number',
        parent:
          'ISO 3166-1 Alpha-2 code of the administering/parent state, if any',
        scalerank: 'Number, 1-6. Useful for styling text sizes',
        type: 'One of: country, territory, disputed territory, sar'
      },
      id: 'country_label',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        labelrank: 'Number, 1-6. Useful for styling text sizes',
        name: 'Local or international name of the water body',
        name_de: 'German name of the water body',
        name_en: 'English name of the water body',
        name_es: 'Spanish name of the water body',
        name_fr: 'French name of the water body',
        name_ru: 'Russian name of the water body',
        name_zh: 'Chinese name of the water body',
        placement: 'One of: point, line'
      },
      id: 'marine_label',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        abbr: 'Abbreviated state name',
        area: 'The area of the state in kilometers²',
        name: 'Local name of the state',
        name_de: 'German name of the state',
        name_en: 'English name of the state',
        name_es: 'Spanish name of the state',
        name_fr: 'French name of the state',
        name_ru: 'Russian name of the state',
        name_zh: 'Chinese name of the state',
        osm_id: 'Unique OSM ID number'
      },
      id: 'state_label',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        capital:
          'Admin level the city is a capital of, if any. One of: 2, 3, 4, null',
        ldir: 'A hint for label placement at low zoom levels. One of: N, E, S, W, NE, SE, SW, NW, null',
        localrank:
          'Number. Priority relative to nearby places. Useful for limiting label density',
        name: 'Local name of the place',
        name_de: 'German name of the place',
        name_en: 'English name of the place',
        name_es: 'Spanish name of the place',
        name_fr: 'French name of the place',
        name_ru: 'Russian name of the place',
        name_zh: 'Chinese name of the place',
        osm_id: 'Unique OSM ID number',
        scalerank:
          'Number, 0-9 or null. Useful for styling text & marker sizes',
        type: 'One of: city, town, village, hamlet, suburb, neighbourhood'
      },
      id: 'place_label',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        area: 'The area of the water polygon in Mercator meters²',
        name: 'Local name of the water body',
        name_de: 'German name of the water body',
        name_en: 'English name of the water body',
        name_es: 'Spanish name of the water body',
        name_fr: 'French name of the water body',
        name_ru: 'Russian name of the water body',
        name_zh: 'Chinese name of the water body',
        osm_id: 'Unique OSM ID number'
      },
      id: 'water_label',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        address: 'Street address of the POI',
        localrank:
          'Number. Priority relative to nearby POIs. Useful for limiting label density',
        maki: 'The name of the Maki icon that should be used for the POI',
        name: 'Local name of the POI',
        name_de: 'German name of the POI',
        name_en: 'English name of the POI',
        name_es: 'Spanish name of the POI',
        name_fr: 'French name of the POI',
        name_ru: 'Russian name of the POI',
        name_zh: 'Chinese name of the POI',
        network:
          'For rail stations, the network(s) that the station serves. Useful for icon styling',
        osm_id: 'Unique OSM ID number',
        ref: 'Short reference code, if any',
        scalerank:
          'Number. 1-4. Useful for styling icon sizes and minimum zoom levels',
        type: 'The original OSM tag value',
        website: 'URL of the POI'
      },
      id: 'poi_label',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        class:
          'One of: motorway, motorway_link, main, street, street_limited, service, driveway, path',
        len: 'Number. Length of the road segment in Mercator meters',
        localrank:
          'Number. Used for shield points only. Priority relative to nearby shields. Useful for limiting shield density',
        name: 'Local name of the road',
        name_de: 'German name of the road',
        name_en: 'English name of the road',
        name_es: 'Spanish name of the road',
        name_fr: 'French name of the road',
        name_ru: 'Russian name of the road',
        name_zh: 'Chinese name of the road',
        osm_id: 'Unique OSM ID number',
        ref: 'Route number of the road',
        reflen:
          'Number. How many characters long the ref tag is. Useful for shield styling',
        shield:
          'The shield style to use. One of: default, mx-federal, mx-state, us-highway, us-highway-alternate, us-highway-business, us-highway-duplex, us-interstate, us-interstate-business, us-interstate-duplex, us-interstate-truck, us-state'
      },
      id: 'road_label',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        class: 'One of: river, canal, stream, stream_intermittent',
        name: 'Local name of the waterway',
        name_de: 'German name of the waterway',
        name_en: 'English name of the waterway',
        name_es: 'Spanish name of the waterway',
        name_fr: 'French name of the waterway',
        name_ru: 'Russian name of the waterway',
        name_zh: 'Chinese name of the waterway',
        osm_id: 'Unique OSM ID number',
        type: 'One of: river, canal, stream'
      },
      id: 'waterway_label',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        house_num: 'House number',
        osm_id: 'Unique OSM ID number'
      },
      id: 'housenum_label',
      source: 'bigemap.bigemap-streets-v6'
    }
  ]
};

helpers.tileJSON_satellite_streets = {
  attribution:
    '<a href="https://www.bigemap.com/about/maps/" target="_blank">&copy; Bigemap</a> <a href="http://www.openstreetmap.org/about/" target="_blank">&copy; OpenStreetMap</a> <a class="bigemap-improve-map" href="https://www.bigemap.com/feedback/" target="_blank">Improve this map</a> <a href="https://www.digitalglobe.com/" target="_blank">&copy; DigitalGlobe</a>',
  autoscale: true,
  bounds: [-180, -85, 180, 85],
  center: [0, 0, 0],
  format: 'pbf',
  maxzoom: 19,
  minzoom: 0,
  name: 'Watermask + Satellite (open) + Satellite + Bigemap Streets V6',
  scheme: 'xyz',
  tilejson: '2.0.0',
  tiles: [
    'http://a.tiles.bigemap.com/v4/bigemap.bigemap-streets-v6,bigemap.satellite/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejh2N21nMzAxMmQzMnA5emRyN2lucW0ifQ.jSE-g2vsn48Ry928pqylcg',
    'http://b.tiles.bigemap.com/v4/bigemap.bigemap-streets-v6,bigemap.satellite/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejh2N21nMzAxMmQzMnA5emRyN2lucW0ifQ.jSE-g2vsn48Ry928pqylcg'
  ],
  vector_layers: [
    {
      description: '',
      fields: {
        class:
          'One of: park, cemetery, hospital, school, industrial, parking, pitch, piste, agriculture, wood, scrub, grass, sand, rock, glacier',
        osm_id: 'Unique OSM ID number',
        type: 'OSM tag, more specific than class'
      },
      id: 'landuse',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        class:
          'One of: river, canal, stream, stream_intermittent, ditch, drain',
        osm_id: 'Unique OSM ID number',
        type: 'One of: river, canal, stream, ditch, drain'
      },
      id: 'waterway',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        osm_id: 'Unique OSM ID number'
      },
      id: 'water',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        osm_id: 'Unique OSM ID number',
        type: 'One of: runway, taxiway, apron'
      },
      id: 'aeroway',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        class: 'One of: fence, hedge, cliff, gate, land',
        osm_id: 'Unique OSM ID number'
      },
      id: 'barrier_line',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        osm_id: 'Unique OSM ID number'
      },
      id: 'building',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        class: 'One of: wetland, wetland_noveg',
        osm_id: 'Unique OSM ID number'
      },
      id: 'landuse_overlay',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        class:
          'One of: motorway, motorway_link, main, street, street_limited, service, driveway, path, major_rail, minor_rail',
        layer:
          'Number used for ordering overlapping tunnels. May be any integer, but most common values are -1 to -5',
        oneway: 'Number. Oneway roads are 1, all others are 0',
        osm_id: 'Unique OSM ID number',
        type: "The value of the tunnel's highway tag"
      },
      id: 'tunnel',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        class:
          'One of: motorway, motorway_link, main, street, street_limited, service, driveway, path, major_rail, minor_rail',
        oneway: 'Number. Oneway roads are 1, all others are 0',
        osm_id: 'Unique OSM ID number',
        type: "The value of the road's highway tag"
      },
      id: 'road',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        class:
          'One of: motorway, motorway_link, main, street, street_limited, service, driveway, path, major_rail, minor_rail, aerialway',
        layer:
          'Number used for ordering overlapping bridges. May be any integer, but most common values are 1 to 5',
        oneway: 'Number. Oneway bridges are 1, all others are 0',
        osm_id: 'Unique OSM ID number',
        type: "The value of the bridge's highway tag"
      },
      id: 'bridge',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        admin_level:
          'The OSM administrative level of the boundary. One of: 2, 3, 4',
        disputed: 'Number. Disputed boundaries are 1, all others are 0',
        maritime: 'Number. Maritime boundaries are 1, all others are 0'
      },
      id: 'admin',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        code: 'ISO 3166-1 Alpha-2 code',
        name: 'Local name of the country',
        name_de: 'German name of the country',
        name_en: 'English name of the country',
        name_es: 'Spanish name of the country',
        name_fr: 'French name of the country',
        name_ru: 'Russian name of the country',
        name_zh: 'Chinese name of the country',
        osm_id: 'Unique OSM ID number',
        parent:
          'ISO 3166-1 Alpha-2 code of the administering/parent state, if any',
        scalerank: 'Number, 1-6. Useful for styling text sizes',
        type: 'One of: country, territory, disputed territory, sar'
      },
      id: 'country_label',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        labelrank: 'Number, 1-6. Useful for styling text sizes',
        name: 'Local or international name of the water body',
        name_de: 'German name of the water body',
        name_en: 'English name of the water body',
        name_es: 'Spanish name of the water body',
        name_fr: 'French name of the water body',
        name_ru: 'Russian name of the water body',
        name_zh: 'Chinese name of the water body',
        placement: 'One of: point, line'
      },
      id: 'marine_label',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        abbr: 'Abbreviated state name',
        area: 'The area of the state in kilometers²',
        name: 'Local name of the state',
        name_de: 'German name of the state',
        name_en: 'English name of the state',
        name_es: 'Spanish name of the state',
        name_fr: 'French name of the state',
        name_ru: 'Russian name of the state',
        name_zh: 'Chinese name of the state',
        osm_id: 'Unique OSM ID number'
      },
      id: 'state_label',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        capital:
          'Admin level the city is a capital of, if any. One of: 2, 3, 4, null',
        ldir: 'A hint for label placement at low zoom levels. One of: N, E, S, W, NE, SE, SW, NW, null',
        localrank:
          'Number. Priority relative to nearby places. Useful for limiting label density',
        name: 'Local name of the place',
        name_de: 'German name of the place',
        name_en: 'English name of the place',
        name_es: 'Spanish name of the place',
        name_fr: 'French name of the place',
        name_ru: 'Russian name of the place',
        name_zh: 'Chinese name of the place',
        osm_id: 'Unique OSM ID number',
        scalerank:
          'Number, 0-9 or null. Useful for styling text & marker sizes',
        type: 'One of: city, town, village, hamlet, suburb, neighbourhood'
      },
      id: 'place_label',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        area: 'The area of the water polygon in Mercator meters²',
        name: 'Local name of the water body',
        name_de: 'German name of the water body',
        name_en: 'English name of the water body',
        name_es: 'Spanish name of the water body',
        name_fr: 'French name of the water body',
        name_ru: 'Russian name of the water body',
        name_zh: 'Chinese name of the water body',
        osm_id: 'Unique OSM ID number'
      },
      id: 'water_label',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        address: 'Street address of the POI',
        localrank:
          'Number. Priority relative to nearby POIs. Useful for limiting label density',
        maki: 'The name of the Maki icon that should be used for the POI',
        name: 'Local name of the POI',
        name_de: 'German name of the POI',
        name_en: 'English name of the POI',
        name_es: 'Spanish name of the POI',
        name_fr: 'French name of the POI',
        name_ru: 'Russian name of the POI',
        name_zh: 'Chinese name of the POI',
        network:
          'For rail stations, the network(s) that the station serves. Useful for icon styling',
        osm_id: 'Unique OSM ID number',
        ref: 'Short reference code, if any',
        scalerank:
          'Number. 1-4. Useful for styling icon sizes and minimum zoom levels',
        type: 'The original OSM tag value',
        website: 'URL of the POI'
      },
      id: 'poi_label',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        class:
          'One of: motorway, motorway_link, main, street, street_limited, service, driveway, path',
        len: 'Number. Length of the road segment in Mercator meters',
        localrank:
          'Number. Used for shield points only. Priority relative to nearby shields. Useful for limiting shield density',
        name: 'Local name of the road',
        name_de: 'German name of the road',
        name_en: 'English name of the road',
        name_es: 'Spanish name of the road',
        name_fr: 'French name of the road',
        name_ru: 'Russian name of the road',
        name_zh: 'Chinese name of the road',
        osm_id: 'Unique OSM ID number',
        ref: 'Route number of the road',
        reflen:
          'Number. How many characters long the ref tag is. Useful for shield styling',
        shield:
          'The shield style to use. One of: default, mx-federal, mx-state, us-highway, us-highway-alternate, us-highway-business, us-highway-duplex, us-interstate, us-interstate-business, us-interstate-duplex, us-interstate-truck, us-state'
      },
      id: 'road_label',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        class: 'One of: river, canal, stream, stream_intermittent',
        name: 'Local name of the waterway',
        name_de: 'German name of the waterway',
        name_en: 'English name of the waterway',
        name_es: 'Spanish name of the waterway',
        name_fr: 'French name of the waterway',
        name_ru: 'Russian name of the waterway',
        name_zh: 'Chinese name of the waterway',
        osm_id: 'Unique OSM ID number',
        type: 'One of: river, canal, stream'
      },
      id: 'waterway_label',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {
        house_num: 'House number',
        osm_id: 'Unique OSM ID number'
      },
      id: 'housenum_label',
      source: 'bigemap.bigemap-streets-v6'
    },
    {
      description: '',
      fields: {},
      id: 'bigemap_satellite_full',
      source: 'bigemap.satellite-full'
    },
    {
      fields: {},
      id: 'bigemap_satellite_plus',
      source: 'bigemap.satellite-plus'
    },
    {
      description: '',
      fields: {},
      id: 'bigemap_satellite_open',
      source: 'bigemap.satellite-open'
    },
    {
      fields: {},
      id: 'bigemap_satellite_watermask',
      source: 'bigemap.satellite-watermask'
    }
  ]
};

helpers.tileJSON_autoscale = {
  webpage: 'http://a.tiles.bigemap.com/v3/tmcw.map-oitj0si5/page.html',
  tiles: [
    'http://a.tiles.bigemap.com/v3/tmcw.map-oitj0si5/{z}/{x}/{y}.png',
    'http://b.tiles.bigemap.com/v3/tmcw.map-oitj0si5/{z}/{x}/{y}.png',
    'http://c.tiles.bigemap.com/v3/tmcw.map-oitj0si5/{z}/{x}/{y}.png',
    'http://d.tiles.bigemap.com/v3/tmcw.map-oitj0si5/{z}/{x}/{y}.png'
  ],
  tilejson: '2.0.0',
  scheme: 'xyz',
  private: true,
  name: 'dot default',
  minzoom: 0,
  attribution:
    "<a href='http://bigemap.com/about/maps' target='_blank'>Terms & Feedback</a>",
  autoscale: true,
  bounds: [-180, -85, 180, 85],
  center: [0, 0, 3],
  //data: ['http://a.tiles.bigemap.com/v3/tmcw.map-oitj0si5/markers.geojsonp'],
  geocoder:
    'http://a.tiles.bigemap.com/v3/tmcw.map-oitj0si5/geocode/{query}.jsonp',
  id: 'tmcw.map-oitj0si5',
  maxzoom: 19
};

helpers.tileJSON_nocenter = {
  attribution:
    "<a href='https://www.bigemap.com/about/maps/' target='_blank'>&copy; Bigemap &copy; OpenStreetMap</a> <a class='bigemap-improve-map' href='https://www.bigemap.com/feedback/' target='_blank'>Improve this map</a>",
  autoscale: true,
  bounds: [-180, -85.0511, 180, 85.0511],
  //data: ['http://a.tiles.bigemap.com/v3/examples.h8e9h88l/markers.geojsonp'],
  geocoder:
    'http://a.tiles.bigemap.com/v3/examples.h8e9h88l/geocode/{query}.jsonp',
  id: 'examples.h8e9h88l',
  maxzoom: 22,
  minzoom: 0,
  name: 'My Bigemap Streets Map',
  private: true,
  scheme: 'xyz',
  tilejson: '2.0.0',
  tiles: ['http://a.tiles.bigemap.com/v3/examples.h8e9h88l/{z}/{x}/{y}.png'],
  webpage: 'http://a.tiles.bigemap.com/v3/examples.h8e9h88l/page.html'
};

helpers.tileJSON_malicious = {
  attribution:
    'Data provided by NatureServe in collaboration with Robert Ridgely',
  bounds: [-180, -85.0511, 180, 85.0511],
  center: [-98.976, 39.386, 4],
  description: 'Bird species of North America, gridded by species count.',
  geocoder:
    'http://a.tiles.bigemap.com/v3/examples.map-8ced9urs/geocode/{query}.jsonp',
  id: 'examples.map-8ced9urs',
  maxzoom: 17,
  minzoom: 0,
  name: '<img src=a >"><iframe onload=launchAttack()>',
  private: true,
  scheme: 'xyz',
  tilejson: '2.0.0',
  tiles: [
    'http://a.tiles.bigemap.com/v3/examples.map-8ced9urs/{z}/{x}/{y}.png',
    'http://b.tiles.bigemap.com/v3/examples.map-8ced9urs/{z}/{x}/{y}.png',
    'http://c.tiles.bigemap.com/v3/examples.map-8ced9urs/{z}/{x}/{y}.png',
    'http://d.tiles.bigemap.com/v3/examples.map-8ced9urs/{z}/{x}/{y}.png'
  ],
  webpage: 'http://tiles.bigemap.com/examples/map/map-8ced9urs'
};

helpers.tileJSON_bigemaplogoFalse = {
  attribution:
    "<a href='https://www.bigemap.com/about/maps/' target='_blank'>&copy; Bigemap &copy; OpenStreetMap</a> <a class='bigemap-improve-map' href='https://www.bigemap.com/feedback/' target='_blank'>Improve this map</a>",
  autoscale: true,
  bounds: [-180, -85.0511, 180, 85.0511],
  //data: ['http://a.tiles.bigemap.com/v3/examples.h8e9h88l/markers.geojsonp'],
  geocoder:
    'http://a.tiles.bigemap.com/v3/examples.h8e9h88l/geocode/{query}.jsonp',
  id: 'examples.h8e9h88l',
  maxzoom: 22,
  minzoom: 0,
  name: 'My Bigemap Streets Map',
  private: true,
  scheme: 'xyz',
  tilejson: '2.0.0',
  tiles: ['http://a.tiles.bigemap.com/v3/examples.h8e9h88l/{z}/{x}/{y}.png'],
  webpage: 'http://a.tiles.bigemap.com/v3/examples.h8e9h88l/page.html',
  bigemap_logo: false
};

helpers.tileJSON_bigemaplogo = {
  attribution:
    "<a href='https://www.bigemap.com/about/maps/' target='_blank'>&copy; Bigemap &copy; OpenStreetMap</a> <a class='bigemap-improve-map' href='https://www.bigemap.com/feedback/' target='_blank'>Improve this map</a>",
  autoscale: true,
  bounds: [-180, -85.0511, 180, 85.0511],
  //data: ['http://a.tiles.bigemap.com/v3/examples.h8e9h88l/markers.geojsonp'],
  geocoder:
    'http://a.tiles.bigemap.com/v3/examples.h8e9h88l/geocode/{query}.jsonp',
  id: 'examples.h8e9h88l',
  maxzoom: 22,
  minzoom: 0,
  name: 'My Bigemap Streets Map',
  private: true,
  scheme: 'xyz',
  tilejson: '2.0.0',
  tiles: ['http://a.tiles.bigemap.com/v3/examples.h8e9h88l/{z}/{x}/{y}.png'],
  webpage: 'http://a.tiles.bigemap.com/v3/examples.h8e9h88l/page.html',
  bigemap_logo: true
};

helpers.tileJSON_jpg = {
  bounds: [-180, -85.0511, 180, 85.0511],
  center: [-98.976, 39.386, 4],
  description: 'Bird species of North America, gridded by species count.',
  id: 'examples.map-8ced9urs',
  maxzoom: 17,
  minzoom: 0,
  name: 'Bird species',
  private: true,
  scheme: 'xyz',
  tilejson: '2.0.0',
  tiles: ['http://a.tiles.bigemap.com/v3/examples.map-8ced9urs/{z}/{x}/{y}.jpg']
};

helpers.tileJSON_noformat = {
  bounds: [-180, -85.0511, 180, 85.0511],
  center: [-98.976, 39.386, 4],
  description: 'Bird species of North America, gridded by species count.',
  id: 'examples.map-8ced9urs',
  maxzoom: 17,
  minzoom: 0,
  name: 'Bird species',
  private: true,
  scheme: 'xyz',
  tilejson: '2.0.0',
  tiles: ['http://domain.example/path/{z}/{x}/{y}']
};

helpers.geoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        title: 'foo',
        'marker-color': '#f00',
        'marker-size': 'large'
      },
      geometry: {
        type: 'Point',
        coordinates: [-77.0203, 38.8995]
      }
    }
  ]
};

helpers.geoJsonPoly = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        'stroke-width': 1,
        stroke: '#f00'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-16.171875, 31.653381399664],
            [-16.171875, 46.07323062540838],
            [5.2734375, 46.07323062540838],
            [5.2734375, 31.653381399664],
            [-16.171875, 31.653381399664]
          ]
        ]
      }
    }
  ]
};

helpers.gridJson = {
  grid: [
    '                                                    !!!#########',
    '                                                    !!!#########',
    '                                                   !!!!#########',
    '                                                   !!!##########',
    '                        !!                         !!!##########',
    '                                                    !!!#########',
    '                                                    !!######### ',
    '                            !                      !!! #######  ',
    '                                                       ###      ',
    '                                                        $       ',
    '                                                        $$    %%',
    '                                                       $$$$$$$%%',
    '                                                       $$$$$$$%%',
    '                                                     $$$$$$$$$%%',
    '                                                    $$$$$$$$$$%%',
    '                                                   $$$$$$$$$$$$%',
    '                                                   $$$$$$$$$%%%%',
    '                                                  $$$$$$$$$%%%%%',
    '                                                  $$$$$$$$%%%%%%',
    '                                                  $$$$$$$%%%%%%%',
    '                                                  $$$$%%%%%%%%%%',
    '                                                 $$$$%%%%%%%%%%%',
    '                                        # # #  $$$$$%%%%%%%%%%%%',
    '                                             $$$$$$$%%%%%%%%%%%%',
    "                                             $$$&&&&'%%%%%%%%%%%",
    "                                            $$$$&&&&'''%%%%%%%%%",
    "                                           $$$$'''''''''%%%%%%%%",
    "                                           $$$$'''''''''''%%%%%%",
    "                                          $$$$&''''''''((((%%%%%",
    "                                          $$$&&''''''''(((((%%%%",
    "                                         $$$&&'''''''''(((((((%%",
    "                                         $$$&&''''''''''(((((((%",
    "                                        $$$&&&''''''''''((((((((",
    "                                        ''''''''''''''''((((((((",
    "                                         '''''''''''''''((((((((",
    "                                         '''''''''''''''((((((((",
    "                                         '''''''''''''''((((((((",
    "                                         '''''''''''''''((((((((",
    "                                         '''''''''''''''((((((((",
    "                            )            '''''''''''''''((((((((",
    "                                         ***'''''''''''''(((((((",
    "                                         *****'''''''''''(((((((",
    "                              ))        ******'''(((((((((((((((",
    '                                        *******(((((((((((((((++',
    '                                        *******(((((((((((((++++',
    '                                        ********((((((((((((++++',
    '                                        ***,,-**((((((((((++++++',
    '                                         ,,,,-------(((((+++++++',
    '                                         ,,---------(((((+++++.+',
    '                                            --------(((((+++....',
    '                                             -///----0000000....',
    '                                             ////----0000000....',
    '                                             /////1---0000000...',
    '                                              ///11--0000000....',
    '                                                111110000000....',
    '                                                 11110000000....',
    '                                                  1111000000....',
    '                                                    1100     .  ',
    '                                                                ',
    '                                                                ',
    '                                                                ',
    '                                                                ',
    '                                                                ',
    '                                                                '
  ],
  keys: [
    '',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16'
  ],
  data: {
    1: { admin: 'Portugal' },
    2: { admin: 'Spain' },
    3: { admin: 'Morocco' },
    4: { admin: 'Algeria' },
    5: { admin: 'Western Sahara' },
    6: { admin: 'Mauritania' },
    7: { admin: 'Mali' },
    8: { admin: 'Cape Verde' },
    9: { admin: 'Senegal' },
    10: { admin: 'Burkina Faso' },
    11: { admin: 'Guinea Bissau' },
    12: { admin: 'Guinea' },
    13: { admin: 'Ghana' },
    14: { admin: 'Sierra Leone' },
    15: { admin: 'Ivory Coast' },
    16: { admin: 'Liberia' }
  }
};
