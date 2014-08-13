/**
 * Model of a game that takes advantage of Box2D.
 * @module
 */
define(['box2d'], function(Box2D) {
  'use strict';

  /**
   * @constructor
   * @this {module:model/Game}
   */
  var exports = function() {
    // Multiply all variables with 2 to make them more suitable.
    // See section `1.7 Units` on http://www.box2d.org/manual.html for an
    // explanation of why.
    this.MULTIPLIER = 2;

    // Where to store the walls
    this.walls = [];

    // Create the world
    var gravity = new Box2D.b2Vec2(0.0, 0.0);
    this.world = new Box2D.b2World(gravity);

    // Start with 0 tilt.
    this.horizontalTilt = 0;
    this.verticalTilt = 0;
  };

  /**
   * Create container edges.
   *
   * @this {module:model/Game}
   * @param {Object} width
   * @param {Object} height
   */
  exports.prototype.createContainer = function(width, height) {
    var edges = [
      {
        v1: new Box2D.b2Vec2(0, 0),
        v2: new Box2D.b2Vec2(0, this.MULTIPLIER * height)
      },
      {
        v1: new Box2D.b2Vec2(0, this.MULTIPLIER * height),
        v2: new Box2D.b2Vec2(this.MULTIPLIER * width, this.MULTIPLIER * height)
      },
      {
        v1: new Box2D.b2Vec2(this.MULTIPLIER * width, this.MULTIPLIER * height),
        v2: new Box2D.b2Vec2(this.MULTIPLIER * width, 0)
      },
      {
        v1: new Box2D.b2Vec2(this.MULTIPLIER * width, 0),
        v2: new Box2D.b2Vec2(0, 0)
      }
    ];
    _.forEach(edges, function(edge) {
      var shape = new Box2D.b2EdgeShape();
      shape.Set(edge.v1, edge.v2);

      var bd = new Box2D.b2BodyDef();
      bd.set_type(Box2D.b2_staticBody);

      var body = this.world.CreateBody(bd);
      body.CreateFixture(shape, 0);
    }.bind(this));
  };

  /**
   * Add a wall to the model.
   *
   * @this {module:model/Game}
   * @param {Object} wall
   * @param {number} wall.x X coordinate of the wall's center.
   * @param {number} wall.y Y coordinate of the wall's center.
   * @param {number} wall.width Width of the wall.
   * @param {number} wall.height Height of the wall.
   * @returns {b2Body} The Box2D body that was created.
   */
  exports.prototype.createWall = function(wall) {
    var shape = new Box2D.b2PolygonShape();
    // Divide with 2 because Box2d's method wants the half-width and the
    // half-height, see:
    // http://hodade.adam.ne.jp/box2d/API/html/classb2_polygon_shape.html#a6bb90df8b4a40d1c53b64cc352a855dd
    shape.SetAsBox(
      this.MULTIPLIER * wall.width / 2, this.MULTIPLIER * wall.height / 2
    );

    var bd = new Box2D.b2BodyDef();
    bd.set_type(Box2D.b2_staticBody);
    bd.set_position(
      new Box2D.b2Vec2(this.MULTIPLIER * wall.x, this.MULTIPLIER * wall.y)
    );

    var body = this.world.CreateBody(bd);
    body.CreateFixture(shape, 0);

    this.walls.push({
      body: body,
      width: this.MULTIPLIER * wall.width,
      height: this.MULTIPLIER * wall.height
    });

    return body;
  };

  /**
   * Add a ball.
   *
   * @this {module:model/Game}
   * @param {Object} ball
   * @param {number} ball.x X coordinate.
   * @param {number} ball.y Y coordinate.
   * @returns {b2Body} The Box2D body that was created.
   */
  exports.prototype.createBall = function(ball) {
    var shape = new Box2D.b2CircleShape();
    // Make the ball to a fourth the size of a wall cell
    var radius = this.MULTIPLIER / 8;
    shape.set_m_radius(radius);

    var bd = new Box2D.b2BodyDef();
    bd.set_type(Box2D.b2_dynamicBody);
    // Add 0.5 to place it in the center of the cell
    bd.set_position(new Box2D.b2Vec2(
      this.MULTIPLIER * (ball.x + 0.5),
      this.MULTIPLIER * (ball.y + 0.5)
    ));

    var body = this.world.CreateBody(bd);
    var fixtureDef = new Box2D.b2FixtureDef();
    fixtureDef.set_shape(shape);
    fixtureDef.set_density(5.0);
    fixtureDef.set_restitution(0.1);
    body.CreateFixture(fixtureDef);

    this.ball = {body: body, radius: radius};

    return body;
  };

  /**
   * Add the exit path.
   *
   * @this {module:model/Game}
   * @param {Array.<Object>} exitPath
   * @param {number} exitPath.x X coordinate of the cell's center.
   * @param {number} exitPath.y Y coordinate of the cell's center.
   */
  exports.prototype.addExitPath = function(exitPath) {
    this.exitPath = _.map(exitPath, function(pathCell) {
      // Adjust the exit path coordinates with the model's multiplier
      return {
        x: pathCell.x * this.MULTIPLIER,
        y: pathCell.y * this.MULTIPLIER
      };
    }.bind(this));
  };

  /**
   * Step the game model.
   *
   * @this {module:model/Game}
   * @param {number} deltaTime Time step that the world should progress.
   */
  exports.prototype.step = function(deltaTime) {
    this.ball.body.ApplyForceToCenter(new Box2D.b2Vec2(
      // Multiply with the multiplier to the power of 2 because the area
      // of the ball increases x^2 times when the side indreases x times.
      Math.pow(this.MULTIPLIER, 2) * this.horizontalTilt * 1,
      Math.pow(this.MULTIPLIER, 2) * this.verticalTilt * 1
    ));
    this.world.Step(deltaTime, 3, 3);
  };

  /**
   * Tilt the labyrinth to the left.
   */
  exports.prototype.tiltLeft = function() {
    this.horizontalTilt = -1;
  };

  /**
   * Tilt the labyrinth to the right.
   *
   * @this {module:model/Game}
   */
  exports.prototype.tiltRight = function() {
    this.horizontalTilt = 1;
  };

  /**
   * Reset the horizontal labyrinth tilt.
   *
   * @this {module:model/Game}
   */
  exports.prototype.releaseHorizontalTilt = function() {
    this.horizontalTilt = 0;
  };

  /**
   * Tilt the labyrinth downwards.
   *
   * @this {module:model/Game}
   */
  exports.prototype.tiltDown = function() {
    this.verticalTilt = -1;
  };

  /**
   * Tilt the labyrinth upwards.
   *
   * @this {module:model/Game}
   */
  exports.prototype.tiltUp = function() {
    this.verticalTilt = 1;
  };

  /**
   * Reset the vertical labyrinth tilt.
   *
   * @this {module:model/Game}
   */
  exports.prototype.releaseVerticalTilt = function() {
    this.verticalTilt = 0;
  };

  return exports;
});
