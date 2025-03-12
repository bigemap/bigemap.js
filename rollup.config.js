import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import cloneDeep from 'lodash/cloneDeep';
import postcss from 'rollup-plugin-postcss';

//import packageInfo from '../package.json';

// var copyright = '/* ' + packageInfo.name + ' - v' + packageInfo.version + ' - ' + new Date().toString() + '\n' +
//                 ' * Copyright (c) ' + new Date().getFullYear() + ' Environmental Systems Research Institute, Inc.\n' +
//                 ' * ' + packageInfo.license + ' */';

const isProduction = process.env.NODE_ENV === 'production';
const suffix = isProduction ? '' : '-src';
const postcssOpts = {
  extract: true,
  minimize: isProduction
};

function mkoutput(filename) {
  return [
    {
      file: `dist/${filename}.js`,
      //banner: copyright,
      format: 'umd',
      name: 'L.bigemap',
      globals: {
        leaflet: 'L'
      },
      sourcemap: true
    },
    {
      file: `dist/${filename}.esm.js`,
      //banner: copyright,
      format: 'es',
      sourcemap: true
    }
  ];
}

const config = {
  input: 'src/index.js',

  plugins: [
    resolve({
      jsnext: true,
      main: false,
      browser: true,
      extensions: ['.js', '.json']
    }),
    commonjs(),
    json(),
    isProduction && terser({ format: { comments: /Bigemap/ } })
  ],

  output: mkoutput(`bigemap${suffix}`)
};

const standalone = cloneDeep(config);
standalone.external = ['leaflet'];
standalone.input = 'src/bigemap.js';
standalone.output = mkoutput(`bigemap-leaflet${suffix}`);

const internals = cloneDeep(config);
internals.external = ['leaflet'];
internals.input = 'src/internals.js';
internals.output = mkoutput(`internals${suffix}`);

config.plugins.push(postcss(postcssOpts));
standalone.plugins.push(postcss(postcssOpts));

export default [config, standalone, internals];
