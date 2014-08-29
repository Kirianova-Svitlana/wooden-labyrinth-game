'use strict';

require.config({
  baseUrl: 'js',
  paths: {
    three: '../lib/three.min',
    lodash: '../lib/lodash.min',
    box2d: '../lib/box2d',
  },
  shim: {
    three: {
      exports: 'THREE',
    },
    box2d: {
      exports: 'Box2D',
    },
  },
});

require([
  'controller/Game',
], function(GameController) {
  new GameController();
});
