/**
 * Model of a ball.
 * @module
 */
define(['lodash'], function(_) {
  'use strict';

  /**
   * @constructor
   * @this {module:model/Wall}
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   */
  var exports = function(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    // These two variables helps with the collision handling algorithm
    this.__rotatedX = y;
    this.__rotatedY = x;
  };

  /**
   * @param {module:model/Wall} wall
   */
  exports.prototype.handleCollision = function(wall) {
    _.forEach(wall.edges, function(wallEdge) {
      var ball, edge;
      // Initialize ball and edge.
      // Both the ball and the edge are rotated by 90 degrees if the edge is
      // vertical.
      if (edge.isHorizontal()) {
        ball = {
          x: this.x,
          y: this.y,
        };
        edge = {
          x1: wallEdge.v1.x,
          x2: wallEdge.v2.x,
          y: wallEdge.v1.y,
        };
      } else {
        ball = {
          x: this.__rotatedX,
          y: this.__rotatedY,
        };
        edge = {
          x1: wallEdge.v1Rotated.x,
          x2: wallEdge.v2Rotated.x,
          y: wallEdge.v1Rotated.y,
        };
      }

      // Check if the ball is above the edge, looking like this:
      //
      //      O
      //   -------
      if (ball.y - this.radius > edge.y) {
        return;
      }

      // Check if the ball is below the edge, looking like this:
      //
      //   -------
      //      O
      if (ball.y + this.radius < edge.y) {
        return;
      }

      // Check if the ball is to the left of the edge, looking like this:
      //
      //   O -------
      if (ball.x + this.radius < edge.x1) {
        return;
      }

      // Check if the ball is to the right of the edge, looking like this:
      //
      //   ------- O
      if (ball.x - this.radius < edge.x2) {
        return;
      }

      // Finally, handle
    });
  };

  return exports;
});
