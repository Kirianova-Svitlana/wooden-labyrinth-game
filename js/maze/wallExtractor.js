/**
 * This module extracts the walls from a matrix maze with each wall as an
 * object.
 *
 * @example
 * // Example usage
 * wallExtractor.extract(maze);
 * // Returns:
 * [{height: 1, width: 1, x: 0, y: 6}, {height: 5, width: 1, x: 1, y: 0}, ...]
 *
 * // Where the maze looks like:
 * matrixMaze.printMatrix(maze)
 * -W----##--
 * -W-##---#-
 * -W-##-#---
 * -W---#-#-#
 * -W##-#-#--
 * -----#-##-
 * W-##-#----
 * -#--#--###
 * ---##-##--
 * -#-------#
 * // The two walls from the extract function shown above have been highlighted
 * // with W characters
 *
 * @module
 */
define([
  'lodash',
], function(_) {
  'use strict';

  var exports = {

    /**
     * Add sentinel nodes to the end of the columns and rows.
     *
     * <p>All of these added nodes are floor nodes and they are put in to make
     * the loops in this module easier to work with. With these sentinel nodes
     * there is no need to handle the last cell in a row or column in a special
     * way.</p>
     *
     * @param {Array.<Array.<Object>>} maze A maze matrix.
     * @param maze.wall {boolean}
     */
    __addSentinelCells: function(maze) {
      // Add a sentinel cell to each row
      _.forEach(maze, function(row) {
        row.push({wall: false});
      });

      // Add a sentinel row
      maze.push(_.map(new Array(maze[0].length), function() {
        return {wall: false};
      }));
    },

    /**
     * Get the horizontal wall starting at (y, x) and as long as possible with
     * increasing x values.
     *
     * @param {Array.<Array.<Object>>} maze A maze matrix.
     * @param maze.wall {boolean}
     * @param {number} y
     * @param {number} x
     * @returns {Array.<Object>} An array of objects with x and y coordinates.
     */
    __getHorizontalWallStrip: function(maze, y, x) {
      var wall = [];
      for (var columnIndex = x; columnIndex < maze[0].length; ++columnIndex) {
        var cell = maze[y][columnIndex];
        if (cell.wall) {
          wall.push({y: y, x: columnIndex});
        } else {
          return wall;
        }
      }
    },


    /**
     * Get the vertical wall starting at (y, x) and as long as possible with
     * increasing y values.
     *
     * @param {Array.<Array.<Object>>} maze A maze matrix.
     * @param maze.wall {boolean}
     * @param {number} y
     * @param {number} x
     * @returns {Array.<Object>} An array of objects with x and y coordinates.
     */
    __getVerticalWallStrip: function(maze, y, x) {
      var wall = [];
      for (var rowIndex = y; rowIndex < maze.length; ++rowIndex) {
        var cell = maze[rowIndex][x];
        if (cell.wall) {
          wall.push({y: rowIndex, x: x});
        } else {
          return wall;
        }
      }
    },

    /**
     * @param {Array.<Array.<Object>>} maze A maze matrix.
     * @param maze.wall {boolean}
     * @param {Array.<Object>} wall An array of wall cells to change to floors.
     * @param wall.x {number}
     * @param wall.y {number}
     */
    __removeWall: function(maze, wall) {
      _.forEach(wall, function(cell) {
        maze[cell.y][cell.x].wall = false;
      });
    },

    /**
     * Extract the walls from a matrix maze.
     *
     * @param {Array<Array<Object>>} maze A matrix maze.
     * @returns {Array<Object>} A list of wall objects with attributes `x`,
     *   `y`, `width` and `height`.
     */
    extract: function(maze) {
      // Make a copy of the maze
      maze = _.clone(maze, true);
      this.__addSentinelCells(maze);

      var walls = [];

      for (var columnIndex = 0; columnIndex < maze[0].length - 1; ++columnIndex) {
        for (var rowIndex = 0; rowIndex < maze.length - 1; ++rowIndex) {
          if (!maze[rowIndex][columnIndex].wall) {
            // Ignore the cell if it's a floor tile
            continue;
          }
          // Get a horizontal wall starting at the current cell
          var horizontalWall = this.__getHorizontalWallStrip(
            maze, rowIndex, columnIndex
          );
          // Get a vertical wall starting at the current cell
          var verticalWall = this.__getVerticalWallStrip(
            maze, rowIndex, columnIndex
          );
          var longestWall;
          if (horizontalWall.length >= verticalWall.length) {
            longestWall = horizontalWall;
            walls.push({
              y: rowIndex,
              x: columnIndex,
              width: longestWall.length,
              height: 1
            });
          } else {
            longestWall = verticalWall;
            walls.push({
              y: rowIndex,
              x: columnIndex,
              width: 1,
              height: longestWall.length
            });
          }
          // Remove the picked wall from the maze so none of its cells are
          // unnecessarily added in multple walls
          this.__removeWall(maze, longestWall);
        }
      }

      return walls;
    },
  };

  return exports;
});
