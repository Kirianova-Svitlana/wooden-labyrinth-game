/**
 * This module takes a matrix that represents a maze and returns a list of
 * cells where obstacles will be placed.
 * @module
 */
define([
  'lodash',
  './matrixMaze',
], function(_, matrixMaze) {
  'use strict';

  var exports = {

    /**
     * See if a object is in a list of objects.
     *
     * @private
     * @param {Array.<Object>} listOfObjects A list of objects.
     * @param {Object} object The object that should be checked against the
     *   list.
     * @returns {boolean} True if `object` is equal to any of the objects in
     *   `listOfObjects`, false otherwise.
     */
    __objectIsInList: function(listOfObjects, object) {
      return _.some(listOfObjects, function(listObject) {
        return _.isEqual(listObject, object);
      });
    },

    /**
     * Check if any of the objects in `list2` are equal to the objects in
     * `list1`.
     *
     * @private
     * @param {Array.<Object>} list1 A list of objects.
     * @param {Array.<Object>} list2 A second list of objects.
     * @returns {boolean} True if any of the objects in `list1` is equal to any
     *   of the objects in `list2`.
     */
    __anyOfObjectAreInList: function(list1, list2) {
      return _.some(list2, function(cell) {
        return this.__objectIsInList(list1, cell);
      }.bind(this));
    },

    /**
     * Create and get coordinates for a number of obstacles. None of the
     * obstacles will be adjacent to each other.
     *
     * @param {Array.<Array.<Object>>} maze A matrix that represents a maze.
     * @param {boolean} maze.wall If it's a wall or floor.
     * @param {Array.<Object>} ignoreCells A list of cells to ignore even if
     * they are floor cells.
     * @param {number} ignoreCells.x
     * @param {number} ignoreCells.y
     * @param {number} numberOfObstacles The maximum number of obstacles that
     *   will be placed into the maze.
     * @returns {Array.<Object>} A list of cells where the obstacles should be
     *   placed. Each list element is an object with the attributes `x` and
     *   `y`.
     */
    place: function(maze, ignoreCells, numberOfObstacles) {
      var potentialCells = [];
      // Iterate through all the maze's cells and add store which ones are
      // floors and not in the `ignoreCells` list.
      _.forEach(maze, function(row, rowIndex) {
        _.forEach(maze, function(cell, cellIndex) {
          if (
            // The cell isn't a floor
            !maze[rowIndex][cellIndex].wall &&
            // And the cell isn't in the ignore list
            !this.__objectIsInList(ignoreCells, {y: rowIndex, x: cellIndex})
          ) {
            potentialCells.push({y: rowIndex, x: cellIndex});
          }
        }.bind(this));
      }.bind(this));

      // Shuffle the list so they are taken in random order
      potentialCells = _.shuffle(potentialCells);

      // Where the obstacles will be placed
      var obstacles = [];
      // Loop while there are potential cells left and it hasn't exceeded the
      // `numberOfObstacles` cap.
      for (
        var i = 0;
        obstacles.length < numberOfObstacles && i < potentialCells.length;
        ++i
      ) {
        var cell = potentialCells[i];
        // Get all neighbor cells
        var neighborCells = matrixMaze.getCellNeighbors(maze, cell.y, cell.x);
        // Only add the cell as an obstacle if none of its neighbors are
        // already in the obstacles list
        if (!this.__anyOfObjectAreInList(obstacles, neighborCells)) {
          obstacles.push({y: cell.y, x: cell.x});
        }
      }
      return obstacles;
    },
  };

  return exports;
});
