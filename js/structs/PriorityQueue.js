/**
 * A priority queue data structure.
 * @module
 * @see {@link https://en.wikipedia.org/wiki/Priority_queue}
 */
define(['lodash'], function(_) {
  'use strict';

  /**
   * @constructor
   * @this {PriorityQueue}
   */
  var exports = function() {
    this.elements = [];
  };

  /**
   * Add an element to the queue.
   *
   * @this {PriorityQueue}
   * @param {Number} priority The priority of the element.
   * @param {Object} data The data that should be stored.
   */
  exports.prototype.enqueue = function(priority, data) {
    _.forEach(this.elements, function(element, index) {
      if (element.priority <= priority) {
        this.elements.slice(index, 0, {priority: priority, data: data});
        return;
      }
    }.bind(this));
    this.elements.push({priority: priority, data: data});
  };

  /**
   * Get and remove the element with the highest priority.
   *
   * @this {PriorityQueue}
   * @returns {Object} The element with highest priority. Also removes it from
   *   the queue. If the `size()` is 0, null is returned instead.
   */
  exports.prototype.dequeue = function() {
    if (this.size() > 0) {
      return this.elements.splice(0, 1)[0].data;
    } else {
      return null;
    }
  };

  /**
   * Get the element with the highest priority without removing it.
   *
   * @this {PriorityQueue}
   * @returns {Object} The element with highest priority and don't remove it.
   *   If the `size()` is 0, null is returned instead.
   */
  exports.prototype.peek = function() {
    return this.size() > 0 ? this.elements[0].data : null;
  };

  /**
   * The number of elements in the queue.
   *
   * @this {PriorityQueue}
   * @returns {Number}
   */
  exports.prototype.size = function() {
    return this.elements.length;
  };

  return exports;
});
