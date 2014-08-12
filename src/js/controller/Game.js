/**
 * @module
 */
define([
  'lodash',
  'maze/creator',
  'model/Game',
  'view/Game',
], function(_, maze, GameModel, GameView) {
  'use strict';

  /**
   * @constructor
   * @this {module:controller/Game}
   */
  var exports = function() {
    // Generate a maze and gets is components
    var mazeComponents = maze.create();

    // Create the game model from the maze components
    this.model = this.__initModel(mazeComponents);

    // Create the view that will render the game model on the screen
    this.view = this.__initView(this.model);

    // Start the render loop
    this.view.render();
  };

  /**
   * Create the game model and its components.
   *
   * @private
   * @param {Object} mazeComponents The components that make up the labyrinth.
   * @param mazeComponents.walls An array of the walls.
   * @param mazeComponents.walls.x
   * @param mazeComponents.walls.y
   * @param mazeComponents.walls.width
   * @param mazeComponents.walls.height
   * @param mazeComponents.start Where the ball should start
   * @param mazeComponents.start.x
   * @param mazeComponents.start.y
   * @param mazeComponents.exitPath An array of object that make up the exit
   *   path that the player should follow to reach the goal.
   * @param mazeComponents.exitPath.x
   * @param mazeComponents.exitPath.y
   * @returns {module:model/Game}
   */
  exports.prototype.__initModel = function(mazeComponents) {
    var gameModel = new GameModel();

    // Init ball
    gameModel.createBall({
      x: mazeComponents.start.x,
      y: mazeComponents.start.y
    });

    // Init walls
    _.forEach(mazeComponents.walls, function(wall) {
      gameModel.createWall({
        // The maze module defines the (X, Y) coordinate as the bottom left
        // corner of the wall cell, while Box2D and THREE define it as the
        // center of the object.
        x: wall.x + wall.width / 2,
        y: wall.y + wall.height / 2,
        width: wall.width,
        height: wall.height,
      });
    }.bind(this));

    // Store the exit path in the model
    gameModel.addExitPath(_.map(mazeComponents.exitPath, function(pathCell) {
      // Move the coordinate to the center of the cell; see the comment above
      // about the walls and their coordinates.
      return {x: pathCell.x + 0.5, y: pathCell.y + 0.5};
    }));

    return gameModel;
  };

  /**
   * Create the game view.
   *
   * @private
   * @param {module:model/Game} model The game model that the view should show
   *  on the screen.
   * @returns {module:view/Game}
   */
  exports.prototype.__initView = function(model) {
    return new GameView(model);
  };

  return exports;
});
