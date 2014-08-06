/**
 * @module
 */
define([
  'lodash',
  './matrixMaze',
  './longestPathFinder',
  './wallExtractor',
], function(_, matrixMaze, longestPathFinder, wallExtractor) {
  'use strict';

  var exports = {

    /**
     * Create a maze and return the inner walls of the maze.
     *
     * @public
     * @param {Object} [args={width: 10, height: 10, start: {x: 0, y: 0}, print: false}]
     *   Arguments object.
     * @returns {Object} An object with properties to construct a maze. The
     *   attribute `walls` is an array of objects with the attributes x, y,
     *   width and height. The attribute `start` says where the ball should
     *   start.
     */
    create: function(args) {
      args = _.isUndefined(args) ? {} : args;
      _.defaults(args, {
        width: 10,
        height: 10,
        start: {
          x: 0,
          y: 0,
        },
        print: true,
      });
      var start = {x: 0, y: 0};
      var maze = matrixMaze.generate(
        _.pick(args, ['width', 'height', 'start', 'print'])
      );
      var exitPath = longestPathFinder.find(maze, start);
      var walls = wallExtractor.extract(maze);
      return {walls: walls, start: start, exitPath: exitPath};
    },
  };

  return exports;
});
