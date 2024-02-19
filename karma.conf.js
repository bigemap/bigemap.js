// Karma configuration
// Generated on Fri Feb 02 2024 17:10:15 GMT+0800 (Central Standard Time)

const isStandalone = process.env.APP_ENV == 'standalone';
let files;
if (isStandalone) {
  files = [
    'node_modules/leaflet/dist/leaflet-src.js',
    'dist/bigemap-leaflet-src.js'
  ];
  console.log('run test for standalone mode.');
} else {
  files = ['dist/bigemap-src.js'];
  console.log('run test for bundle mode.');
}

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ['mocha', 'sinon-chai'],

    // list of files / patterns to load in the browser
    files: [
      'test/helper.js',
      ...files,
      'dist/internals-src.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: {
      'dist/**/*.js': ['sourcemap', 'coverage']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
    reporters: ['mocha', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: ['Chrome'], //, 'Safari'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: Infinity,

    client: {
      mocha: {
        // eslint-disable-next-line no-undef
        forbidOnly: process.env.CI || false
      }
    },

    // Configure the coverage reporters
    coverageReporter: {
      reporters: [
        {
          type: 'html',
          dir: 'coverage/'
        },
        {
          type: 'text'
        }
      ]
    }
  });
};
