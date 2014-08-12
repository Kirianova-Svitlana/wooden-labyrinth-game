/**
 * @module
 */
define([
  'three',
  'lodash',
  'input/Key',
], function(THREE, _, KeyInput) {
  'use strict';

  /**
   * @constructor
   * @param {module:model/Game} model The game model that the view should show
   *  on the screen.
   * @this {module:view/Game}
   */
  var exports = function(model) {
    this.model = model;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.set(0, 0, 20);

    var canvas = document.getElementById('canvas');
    this.renderer = new THREE.WebGLRenderer({canvas: canvas});
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.labyrinthGroup = new THREE.Object3D();
    this.__initBall(this.labyrinthGroup);
    this.__initWalls(this.labyrinthGroup);
    this.__initExitPath(this.labyrinthGroup);
    this.__initLights(this.scene);

    this.scene.add(this.labyrinthGroup);

    this.keyInput = new KeyInput();
  };

  /**
   * Create the ball from the model and add it to `group`.
   *
   * @private
   * @this {module:view/Game}
   * @param {Object3D} group The group that the ball will be added to.
   */
  exports.prototype.__initBall = function(group) {
    var gemoetry = new THREE.SphereGeometry(
      this.model.ball.radius,
      32,
      32
    );
    var material = new THREE.MeshPhongMaterial({color: 0xff0000});
    this.ball = new THREE.Mesh(gemoetry, material);
    this.ball.position.z = 0;
    group.add(this.ball);
  };

  /**
   * Create the walls from the model and add them to `group`.
   *
   * @private
   * @this {module:view/Game}
   * @param {Object3D} group The group that the walls will be added to.
   */
  exports.prototype.__initWalls = function(group) {
    _.forEach(this.model.walls, function(wall) {
      var x = wall.body.GetPosition().get_x();
      var y = wall.body.GetPosition().get_y();
      var gemoetry = new THREE.BoxGeometry(
        wall.width,
        wall.height,
        this.model.MULTIPLIER
      );
      var material = new THREE.MeshPhongMaterial({color: 0x00ff00});
      var cube = new THREE.Mesh(gemoetry, material);
      cube.position.set(
        x - this.model.MULTIPLIER * 5,
        y - this.model.MULTIPLIER * 5,
        0
      );
      group.add(cube);
    }.bind(this));
  };

  /**
   * Create the exit path from the model and add it to `group`.
   *
   * @private
   * @this {module:view/Game}
   * @param {Object3D} group The group that the exit path will be added to.
   */
  exports.prototype.__initExitPath = function(group) {
    _.forEach(this.model.exitPath, function(wall) {
      var gemoetry = new THREE.BoxGeometry(
        this.model.MULTIPLIER,
        this.model.MULTIPLIER,
        this.model.MULTIPLIER
      );
      var material = new THREE.MeshPhongMaterial({color: 0x0000ff});
      var cube = new THREE.Mesh(gemoetry, material);
      cube.position.set(
        wall.x - 5 * this.model.MULTIPLIER,
        wall.y - 5 * this.model.MULTIPLIER,
        -this.model.MULTIPLIER
      );
      group.add(cube);
    }.bind(this));
  };

  /**
   * Create lights and add them to `group`.
   *
   * @private
   * @this {module:view/Game}
   * @param {Object3D} group The group that the lights will be added to.
   */
  exports.prototype.__initLights = function(group) {
    var light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(0, 0, 10);
    group.add(light);
  };

  /**
   * Start the render loop function.
   *
   * @this {module:view/Game}
   */
  exports.prototype.render = function() {
    requestAnimationFrame(this.render.bind(this));

    var bpos = this.model.ball.body.GetPosition();
    this.ball.position.x = bpos.get_x() - this.model.MULTIPLIER * 5;
    this.ball.position.y = bpos.get_y() - this.model.MULTIPLIER * 5;

    if (this.keyInput.isDown(this.keyInput.LEFT)) {
      this.model.tiltLeft();
      this.labyrinthGroup.rotation.y = -Math.PI / 20;
    } else if (this.keyInput.isDown(this.keyInput.RIGHT)) {
      this.model.tiltRight();
      this.labyrinthGroup.rotation.y = Math.PI / 20;
    } else {
      this.model.releaseHorizontalTilt();
      this.labyrinthGroup.rotation.y = 0;
    }
    if (this.keyInput.isDown(this.keyInput.UP)) {
      this.model.tiltUp();
      this.labyrinthGroup.rotation.x = -Math.PI / 20;
    } else if (this.keyInput.isDown(this.keyInput.DOWN)) {
      this.model.tiltDown();
      this.labyrinthGroup.rotation.x = Math.PI / 20;
    } else {
      this.model.releaseVerticalTilt();
      this.labyrinthGroup.rotation.x = 0;
    }

    this.model.step(1/60);

    this.renderer.render(this.scene, this.camera);
  };

  return exports;
});
