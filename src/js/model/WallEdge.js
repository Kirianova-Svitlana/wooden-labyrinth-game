/**
 * Model of a wall's edge.
 * @module
 */
define(['lodash'], function(_) {
  'use strict';

  /**
   * @constructor
   * @this {module:model/Wall}
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   */
  var exports = function(x1, y1, x2, y2) {
    // v1 is the vertex to the left of v2
    if (x1 <= x2) {
      this.v1 = {x: x1, y: y1};
      this.v2 = {x: x2, y: y2};
    } else {
      this.v1 = {x: x2, y: y2};
      this.v2 = {x: x1, y: y1};
    }
    this.__isHorizontal = y1 === y2;
    if (this.v1.y <= this.v2.y) {
      this.v1Rotated = {x: this.v1.y, y: this.v1.x};
      this.v2Rotated = {x: this.v2.y, y: this.v2.x};
    } else {
      this.v1Rotated = {x: this.v2.y, y: this.v2.x};
      this.v2Rotated = {x: this.v1.y, y: this.v1.x};
    }
  };

  /**
   * If the edge is horizontal or vertical.
   *
   * @returns {boolean} True if the edge is horizontal.
   */
  exports.prototype.isHorizontal = function() {
    return this.__isHorizontal;
  };

  /**
   * Rotate the edge 90 degrees by mirroring it along the straight line y=x.
   */
  //exports.prototype.getRotated90Degrees = function() {
    //return {pos1: this.__pos1Rotated, pos2: this.__pos1Rotated};
  //};

  return exports;
});
