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
    this.MULTIPLIER = 10;
    this.walls = [];
    var gravity = new Box2D.b2Vec2(0.0, 0.0);
    this.world = new Box2D.b2World(gravity);
  };

  /**
   * Add a wall to the model.
   *
   * @this {module:model/Game}
   * @param {Object} wall
   * @param {number} wall.x X coordinate.
   * @param {number} wall.y Y coordinate.
   * @param {number} wall.width Width.
   * @param {number} wall.height Height.
   * @returns {b2Body} The Box2D body that was created.
   */
  exports.prototype.createWall = function(wall) {
    var shape = new Box2D.b2PolygonShape();
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

    this.walls.push(body);

    return body;
  };

  /**
   * Add a ball.
   *
   * @this {module:model/Game}
   * @param {Object} ball
   * @param {number} ball.x X coordinate.
   * @param {number} ball.y Y coordinate.
   * @param {number} ball.radius Radius.
   * @returns {b2Body} The Box2D body that was created.
   */
  exports.prototype.createBall = function(ball) {
    var shape = new Box2D.b2CircleShape();
    console.dir(shape);
    shape.set_m_radius(this.MULTIPLIER * ball.radius);

    var bd = new Box2D.b2BodyDef();
    bd.set_type(Box2D.b2_dynamicBody);
    bd.set_position(
      new Box2D.b2Vec2(this.MULTIPLIER * ball.x, this.MULTIPLIER * ball.y)
    );

    var body = this.world.CreateBody(bd);
    var fixtureDef = new Box2D.b2FixtureDef();
    fixtureDef.set_shape(shape);
    fixtureDef.set_density(5.0);
    fixtureDef.set_restitution(1.0);
    body.CreateFixture(fixtureDef);
    body.SetLinearVelocity(new Box2D.b2Vec2(20, 10));

    this.body = body;

    console.dir(body);

    return body;
  };

  /**
   * Get a list of the walls.
   *
   * @this {module:model/Game}
   * @returns {Array.<b2Body>} An array of Box2D bodies.
   */
  exports.prototype.getWalls = function() {
    return this.walls;
  };

  /**
   * Step the game model.
   *
   * @this {module:model/Game}
   * @param {number} deltaTime Time step that the world should progress.
   */
  exports.prototype.step = function(deltaTime) {
    this.world.Step(deltaTime, 3, 3);
  };

  return exports;
});
