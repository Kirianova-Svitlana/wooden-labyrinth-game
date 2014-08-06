/**
 * A module that helps with finding the longest path in a matrix maxe.
 * @module
 */
define([
  'lodash',
  'structs/PriorityQueue',
  './matrixMaze'
], function(_, PriorityQueue, matrixMaze) {
  'use strict';

  var exports = {};

  /**
   * Expand `path`'s end with one cell and put all those possible combinations
   * into `pathsQueue`.
   *
   * <p>The path can branch off into at maximum 4 new paths. When a new path is
   * created it's put into the paths queue where the priority is minus the
   * length of the path. `maze` is also updated for each visited cell with
   * `visited=true`. On the other hand, if `path` doesn't have any adjacent
   * unvisited floor cells nothing is done and the function returns `true`
   * which says that `path` has reached a dead end.</p>
   *
   * @private
   * @param {Array.<Array.<Object>>} maze A matrix that represents a maze.
   * @param maze.wall {boolean}
   * @param maze.visited {boolean}
   * @param {Array.<Object>} path The path that should be expanded.
   * @param path.y {number}
   * @param path.x {number}
   * @param {module:structs/PriorityQueue} pathsQueue Where the expanded paths
   *   should be put.
   * @returns {boolean} If the path has reached a dead end. In this case no new
   *   path is added to `pathsQueue`.
   */
  exports.__expandPath = function(maze, path, pathsQueue) {
    var lastPathCell = path[path.length - 1];
    var y = lastPathCell.y,
        x = lastPathCell.x;
    var neighborCells = matrixMaze.getCellNeighbors(maze, y, x);
    var unvisitedFloorNeighborCells = _.filter(neighborCells, function(cell) {
      // Mark the cell as visited in the maze
      var mazeCell = maze[cell.y][cell.x];
      return !mazeCell.visited && !mazeCell.wall;
    });
    switch (unvisitedFloorNeighborCells.length) {
      case 0:
        // Dead end
        return true;
      case 1:
      case 2:
      case 3:
      case 4:
        _.forEach(unvisitedFloorNeighborCells, function(cell) {
          maze[cell.y][cell.x].visited = true;
          // Clone the path
          var pathClone = _.clone(path, true);
          // Push the unvisited cell to the path
          pathClone.push(_.pick(cell, ['y', 'x']));
          // Add the path to the priority queue
          pathsQueue.enqueue(-pathClone.length, pathClone);
        });
        // No dead end
        return false;
    }
  };

  /**
   * Find the longest path in the maze.
   *
   * @param {Array.<Array.<Object>>} maze A matrix that represents a maze.
   * @param maze.wall {boolean} Whether it's a wall or a floor.
   * @param {Object} start kalle
   * @param start.y {number} Y coordinate.
   * @param start.x {number} X coordinate.
   * @returns {Array.<Object>} An array of objects with x and y attributes.
   */
  exports.find = function(maze, start) {
    // Make a copy of the maze
    maze = _.clone(maze, true);
    // Add an attribute to each floor that saves if it has been visited
    _.forEach(maze, function(row) {
      _.forEach(row, function(cell) {
        if (!cell.wall) {
          cell.visited = false;
        }
      });
    });

    var paths = new PriorityQueue();
    paths.enqueue(-1, [start]);

    var longestPath;

    while(paths.size() > 0) {
      // Get the shortest path
      var path = paths.dequeue();
      var deadEnd = this.__expandPath(maze, path, paths);
      if (deadEnd) {
        longestPath = path;
      }
    }
    return longestPath;
  };

  return exports;
});
