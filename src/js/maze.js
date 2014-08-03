define(['lodash'], function(_) {
  'use strict';

  /**
  * @module maze
  */
  var exports = {

    /**
    * Create a matrix filled with `def`.
    *
    * @private
    * @param {Number} y Height.
    * @param {Number} x Width.
    * @param {Object} def Default element that the matrix should be filled
    *   with.
    * @returns {Array<Array<Object>>}
    */
    __createEmptyMatrix: function(y, x, def) {
      var matrix = _.range(y).map(function() {
        return _.range(x).map(function() {
          return _.clone(def);
        });
      });
      return matrix;
    },

    /**
    * This function will generate a maze through a variation of the DPS
    * algorithm, see:
    * {@link https://en.wikipedia.org/wiki/Maze_generation_algorithm#Depth-first_search}.
    *
    * This method modified the `matrix` in-place.
    *
    * @private
    * @param {Array<Array<Object>>} matrix A maze matrix.
    * @param {Object} start Object with x and y attributes.
    */
    __createMaze: function(matrix, start) {
      matrix[start.y][start.x].wall = false;
      var randomNeighborCell = _.sample(
        this.__getCellNeighbors(matrix, start.y, start.x)
      );
      this.__removeWall(
        matrix, randomNeighborCell.y, randomNeighborCell.x
      );
    },

    /**
     * Attempt to remove the wall at the cell `matrix[y][x]`. Otherwise it does
     * nothing.
     *
     * @private
     * @param {Array<Array<Object>>} matrix A maze matrix.
     * @param {Number} y Y coordinate.
     * @param {Number} x X coordinate.
     * @see {@link module:maze.__createMaze}
     */
    __removeWall: function(matrix, y, x) {
      var neighbors = this.__getCellNeighbors(matrix, y, x);
      var wallNeighbors = _.filter(neighbors, function(neighbor) {
        return matrix[neighbor.y][neighbor.x].wall;
      });

      // If only one of the cell's neighbors is a floor it means that's where we
      // came from and that this path is unexplored.
      if (neighbors.length - wallNeighbors.length === 1) {
        matrix[y][x].wall = false;
        wallNeighbors = _.shuffle(wallNeighbors);
        // Visit each of the neighbor walls in random order
        _.each(wallNeighbors, function(element) {
          this.__removeWall(matrix, element.y, element.x);
        }.bind(this));
      }
      // This wall cell is adjacent to two or more floor cells. Removing the wall
      // from this cell would create a loop in the maze.
    },

    /**
     * Get a list with the neighbors of a cell.
     *
     * @private
     * @param {Array<Array<Object>>} matrix A maze matrix.
     * @param {Number} y Y coordinate.
     * @param {Number} x X coordinate.
     * @returns {Array<Object>} A list with 2, 3 or 4 objects with the
     *   attributes x or y.
     */
    __getCellNeighbors: function(matrix, y, x) {
      var neighbors = [];
      if (y > 0) {
        neighbors.push({y: y - 1, x: x});
      }
      if (y < matrix.length - 1) {
        neighbors.push({y: y + 1, x: x});
      }
      if (x > 0) {
        neighbors.push({y: y, x: x - 1});
      }
      if (x < matrix[0].length - 1) {
        neighbors.push({y: y, x: x + 1});
      }
      return neighbors;
    },

    /**
    * Print an ASCII version of the matrix to the console.
    *
    * @example
    * // An example of such a console output:
    *   ------#---
    *   #-#-#-###-
    *   --###-----
    *   -#---##-#-
    *   -#-#---##-
    *   -#--##---#
    *   --#---##--
    *   #--#-#--#-
    *   --#---#-#-
    *   #---#---#-
    *
    * @private
    * @param {Array<Array<Object>>} matrix A maze matrix.
    */
    __printMatrix: function(matrix) {
      var output = '\n';
      _.each(matrix, function(row, i) {
        _.each(row, function(cell, j) {
          output += matrix[i][j].wall ? '#' : '-';
        });
        output += '\n';
      });
      console.log(output);
    },

    /**
     * Generate a maze.
     *
     * @public
     * @param {Object} [args={width: 10, height: 10, start: {x: 0, y: 0}, print: false}] Arguments object.
     * @returns {Array<Array<Object>>} A maze matrix of objects with an
     *   attribute `wall` that is either true or false.
     */
    generate: function(args) {
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
      var matrix = this.__createEmptyMatrix(10, 10, {wall: true});
      this.__createMaze(matrix, args.start);
      if (args.print) {
        this.__printMatrix(matrix);
      }
      return matrix;
    }
  };

  return exports;
});
