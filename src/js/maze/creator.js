/**
 * @module
 */
define([
  'lodash',
  './matrixMaze',
  './longestPathFinder'
], function(_, matrixMaze, longestPathFinder) {
  'use strict';

  var exports = {

    /**
     * Extract the walls from a matrix maze.
     *
     * @private
     * @param {Array<Array<Object>>} maze A matrix maze.
     * @returns {Array<Object>} A list of wall objects.
     */
    __extractWalls: function(maze) {
      return this.__extractHorizontalWalls(maze).concat(
        this.__extractVerticalWalls(maze)
      );
    },

    /**
     * @private
     * @param {Array<Array<Object>>} maze
     * @returns {Array<Object>}
     */
    __extractHorizontalWalls: function(maze) {
      var walls = [];
      _.forEach(maze, function(row, rowIndex) {
        // Don't add the sentinel node/cell to the original row
        row = _.clone(row);
        // Add a sentinel cell
        row.push({wall: false});
        var wall;
        _.forEach(row, function(cell, columnIndex) {
          if (cell.wall) {
            // Create an initial wall with width 1
            if (_.isUndefined(wall)) {
              wall = {y: rowIndex, x: columnIndex, height: 1, width: 1};
            }
            // A wall already exists
            else {
              // Increase the wall's width with 1 unit
              ++wall.width;
            }
          } else {
            // A wall has been created and now a floor cell was encountered
            if (!_.isUndefined(wall)) {
              // Put the wall into the collection of walls
              walls.push(wall);
              // Reset the wall variable, making it possible to create a new
              // initial wall when a wall cell is encountered
              wall = undefined;
            }
          }
        });
      });
      return walls;
    },

    /**
     * @private
     * @param {Array<Array<Object>>} maze
     * @returns {Array<Object>}
     */
    __extractVerticalWalls: function(maze) {
      // Don't add the sentinel row to the original maze
      maze = _.clone(maze);
      // Add a sentinel row
      maze.push(_.map(new Array(maze[0].length), function() {
        return {wall: false};
      }));
      var walls = [];
      for (var columnIndex = 0; columnIndex < maze[0].length; ++columnIndex) {
        var wall;
        for (var rowIndex = 0; rowIndex < maze.length; ++rowIndex) {
          var cell = maze[rowIndex][columnIndex];
          if (cell.wall) {
            // Create an initial wall with height 1
            if (_.isUndefined(wall)) {
              wall = {y: rowIndex, x: columnIndex, height: 1, width: 1};
            }
            // A wall already exists
            else {
              // Increase the wall's height with 1 unit
              ++wall.height;
            }
          } else {
            // A wall has been created and now a floor cell was encountered
            if (!_.isUndefined(wall)) {
              // Put the wall into the collection of walls
              walls.push(wall);
              // Reset the wall variable, making it possible to create a new
              // initial wall when a wall cell is encountered
              wall = undefined;
            }
          }
        }
      }
      return walls;
    },

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
      var walls = this.__extractWalls(maze);
      return {walls: walls, start: start, exitPath: exitPath};
    },
  };

  return exports;
});
