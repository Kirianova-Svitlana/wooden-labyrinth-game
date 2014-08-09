/**
 * Model of a wall.
 * @module
 */
define(['lodash', './WallEdge'], function(_, Edge) {
  'use strict';

  /**
   * @constructor
   * @this {module:model/Wall}
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  var exports = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.edges = [
      new Edge(x, y, x + width, y),
      new Edge(x + width, y, x + width, y + height),
      new Edge(x + width, y + height, x, y + height),
      new Edge(x, y + height, x, y),
    ];
  };

  return exports;
});
