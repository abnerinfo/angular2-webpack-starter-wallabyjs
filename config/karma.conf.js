/**
 * @author: @AngularClass
 */

var path = require('path');


var isCoverage = process.env.npm_lifecycle_event && process.env.npm_lifecycle_event.startsWith('coverage');

module.exports = function (config) {
  var testWebpackConfig = require('./webpack.test.js');

  // if (!testWebpackConfig.module.postLoaders) {
  //   testWebpackConfig.module.postLoaders = [];
  // }
  // testWebpackConfig.module.postLoaders.push({
  //   test: /\.ts$/,
  //   include: path.join(__dirname, '..','src'),
  //   loader: 'istanbul-instrumenter-loader',
  //   exclude: [/\.spec\.ts$/, /\.e2e\.ts$/, /node_modules/, /config\/spec-bundle.js/]
  // })



  var configuration = {

    // base path that will be used to resolve all patterns (e.g. files, exclude)
    basePath: '',

    plugins: [
      'karma-coverage',
      'karma-webpack',
      'karma-jasmine',
      'karma-mocha-reporter',
      'karma-sourcemap-loader',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-remap-istanbul'
    ],
    /*
     * Frameworks to use
     *
     * available frameworks: https://npmjs.org/browse/keyword/karma-adapter
     */
    frameworks: ['jasmine'],

    // list of files to exclude
    exclude: [],

    /*
     * list of files / patterns to load in the browser
     *
     * we are building the test environment in ./spec-bundle.js
     */
    files: [{ pattern: './config/spec-bundle.js', watched: false }],

    /*
     * preprocess matching files before serving them to the browser
     * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
     */
    preprocessors: { './config/spec-bundle.js': ['webpack', 'sourcemap'] },

    // Webpack Config at ./webpack.test.js
    webpack: testWebpackConfig,

    coverageReporter: {
      reporters: [
        { type: 'text-summary' },
        { type: 'json', file: path.join(__dirname, '../coverage/coverage-final.json') }
      ]
    },

    remapIstanbulReporter: {
      src: 'coverage/coverage-final.json',
      reports: {
        lcovonly: 'coverage/json/lcov.info',
        html: 'coverage/html',
        'text': null
      },
      timeoutNotCreated: 1000, // default value
      timeoutNoMoreFiles: 1000 // default value
    },


    // Webpack please don't spam the console when running in karma!
    webpackServer: { noInfo: true },

    /*
     * test results reporter to use
     *
     * possible values: 'dots', 'progress'
     * available reporters: https://npmjs.org/browse/keyword/karma-reporter
     */
    reporters: ['mocha'].concat(isCoverage ? ['coverage', "karma-remap-istanbul"] : []),

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    /*
     * level of logging
     * possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
     */
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    /*
     * start these browsers
     * available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
     */
    browsers: [
      'Chrome'
    ],

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    /*
     * Continuous Integration mode
     * if true, Karma captures browsers, runs the tests and exits
     */
    singleRun: false
  };

  if(process.env.TRAVIS){
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};
