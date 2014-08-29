/**
 * Class that stores and automatically updates which keys are currently pressed
 *   down.
 *
 * @example
 * // Example usage
 * var keyInput = new KeyInput();
 * if (keyInput.isDown(keyInput.LEFT)) {
 *   --ball.position.x;
 * }
 *
 * @module
 */
define(function() {
  'use strict';

  /**
   * @constructor
   * @this {module:input/Key}
   */
  var exports = function() {
    this.__pressed = {};
    window.addEventListener('keydown', function(event) {
      this.__pressDown(event.keyCode);
    }.bind(this));
    window.addEventListener('keyup', function(event) {
      this.__release(event.keyCode);
    }.bind(this));
  };

  /** Left key code. */
  exports.prototype.LEFT = 37;

  /** Up key code. */
  exports.prototype.UP = 38;

  /** Right key code. */
  exports.prototype.RIGHT = 39;

  /** Down key code. */
  exports.prototype.DOWN = 40;

  /**
   * Check whether a key is pressed down or not. This is preferably called in
   *   the game's main loop.
   *
   * @this {module:input/Key}
   * @param {number} keyCode
   * @returns {boolean}
   */
  exports.prototype.isDown = function(keyCode) {
    return this.__pressed[keyCode];
  };

  /**
   * Press down a key.
   *
   * @private
   * @this {module:input/Key}
   * @param {number} keyCode
   */
  exports.prototype.__pressDown = function(keyCode) {
    this.__pressed[keyCode] = true;
  };

  /**
   * Relase a key.
   *
   * @private
   * @this {module:input/Key}
   * @param {number} keyCode
   */
  exports.prototype.__release = function(keyCode) {
    delete this.__pressed[keyCode];
  };

  return exports;
});
