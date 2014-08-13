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
    this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMapEnabled = true;

    var floorTexturePath = 'img/wood1.png';
    var wallTexturePath = 'img/wood2.png';

    this.labyrinthGroup = new THREE.Object3D();
    this.__initLabyrinthContainer(
      this.labyrinthGroup, floorTexturePath, wallTexturePath
    );
    this.__initBall(this.labyrinthGroup);
    this.__initWalls(this.labyrinthGroup, wallTexturePath);
    this.__initExitPath(this.labyrinthGroup);
    this.__initLights(this.scene);

    this.scene.add(this.labyrinthGroup);

    this.keyInput = new KeyInput();
  };

  exports.prototype.__initLabyrinthContainer = function(
    group, floorTexturePath, wallTexturePath
  ) {
    var walls = [
      { // Left wall
        x: -5.5 * this.model.MULTIPLIER,
        y: 0,
        z: 0,
        width: 1 * this.model.MULTIPLIER,
        height: 10 * this.model.MULTIPLIER,
        texture: new THREE.ImageUtils.loadTexture(wallTexturePath),
        castShadow: true,
      },
      { // Right wall
        x: 5.5 * this.model.MULTIPLIER,
        y: 0,
        z: 0,
        width: 1 * this.model.MULTIPLIER,
        height: 10 * this.model.MULTIPLIER,
        texture: new THREE.ImageUtils.loadTexture(wallTexturePath),
        castShadow: true,
      },
      { // Upper wall
        x: 0,
        y: 5.5 * this.model.MULTIPLIER,
        z: 0,
        width: 12 * this.model.MULTIPLIER,
        height: 1 * this.model.MULTIPLIER,
        texture: new THREE.ImageUtils.loadTexture(wallTexturePath),
        castShadow: true,
      },
      { // Bottom wall
        x: 0,
        y: -5.5 * this.model.MULTIPLIER,
        z: 0,
        width: 12 * this.model.MULTIPLIER,
        height: 1 * this.model.MULTIPLIER,
        texture: new THREE.ImageUtils.loadTexture(wallTexturePath),
        castShadow: true,
      },
      { // Floor
        x: 0,
        y: 0,
        z: -1 * this.model.MULTIPLIER,
        width: 10 * this.model.MULTIPLIER,
        height: 10 * this.model.MULTIPLIER,
        texture: new THREE.ImageUtils.loadTexture(floorTexturePath),
        castShadow: false,
      }
    ];
    _.forEach(walls, function(wall) {
      // Create the box gemoetry
      var gemoetry = new THREE.BoxGeometry(
        wall.width,
        wall.height,
        this.model.MULTIPLIER
      );

      // Create the material
      var material = new THREE.MeshPhongMaterial({map: wall.texture});
      wall.texture.wrapS = wall.texture.wrapT = THREE.RepeatWrapping;
      wall.texture.repeat.set(wall.width / 2, wall.height / 2);

      // Create the box
      var box = new THREE.Mesh(gemoetry, material);
      box.position.set(
        wall.x,
        wall.y,
        wall.z
      );
      box.receiveShadow = true;
      box.castShadow = wall.castShadow;

      group.add(box);
    }.bind(this));
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
    this.ball.position.z = -this.model.MULTIPLIER / 2 + this.model.ball.radius;
    this.ball.castShadow = true;
    this.ball.receiveShadow = true;
    group.add(this.ball);
  };

  /**
   * Create the walls from the model and add them to `group`.
   *
   * @private
   * @this {module:view/Game}
   * @param {Object3D} group The group that the walls will be added to.
   */
  exports.prototype.__initWalls = function(group, wallTexturePath) {
    _.forEach(this.model.walls, function(wall) {
      var x = wall.body.GetPosition().get_x();
      var y = wall.body.GetPosition().get_y();

      // Create the box gemoetry
      var gemoetry = new THREE.BoxGeometry(
        wall.width,
        wall.height,
        this.model.MULTIPLIER
      );

      var texture = new THREE.ImageUtils.loadTexture(wallTexturePath);
      var material = new THREE.MeshPhongMaterial({color: 0xffffff, map: texture});
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(wall.width / 2, wall.height / 2);

      var box = new THREE.Mesh(gemoetry, material);
      box.position.set(
        x - this.model.MULTIPLIER * 5,
        y - this.model.MULTIPLIER * 5,
        0
      );
      box.castShadow = true;
      box.receiveShadow = true;
      group.add(box);
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
      var material = new THREE.MeshPhongMaterial({
        color: 0x0000ff,
        transparent: true,
        opacity: 0.25
      });
      var cube = new THREE.Mesh(gemoetry, material);
      cube.position.set(
        wall.x - 5 * this.model.MULTIPLIER,
        wall.y - 5 * this.model.MULTIPLIER,
        -this.model.MULTIPLIER + 0.01
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
    var light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(10, 10, 60);
    light.castShadow = true;
    //light.shadowCameraVisible = true;
    light.shadowCameraLeft = -12;
    light.shadowCameraRight = 12;
    light.shadowCameraTop = 12;
    light.shadowCameraBottom = -12;
    light.shadowCameraFar = 100;
    light.shadowMapWidth = 1024;
    light.shadowMapHeight = 1024;
    group.add(light);

    light = new THREE.AmbientLight(0x202020);
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
