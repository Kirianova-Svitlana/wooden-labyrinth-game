'use strict';

require.config({
  baseUrl: 'js',
  paths: {
    three: '../lib/three.min',
    lodash: '../lib/lodash.min',
    box2d: '../lib/box2d',
  },
  shim: {
    three: {
      exports: 'THREE',
    },
    box2d: {
      exports: 'Box2D',
    },
  },
});

require([
  'three',
  'lodash',
  'maze/creator',
  'input/Key',
  'box2d',
  'model/Game',
], function(THREE, _, maze, KeyInput, Box2D, Model) {

  var canvas = document.getElementById('canvas');

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  var group = new THREE.Object3D();

  var renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setSize(window.innerWidth, window.innerHeight);

  var light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(4.5, 4.5, 10);
  group.add(light);

  var mazeComponents = maze.create();

  var model = new Model();
  var ball2 = model.createBall({radius: 0.125, x: 0, y: 0});

  _.forEach(mazeComponents.walls, function(wall) {
    var gemoetry = new THREE.BoxGeometry(wall.width, wall.height, 1);
    var material = new THREE.MeshPhongMaterial({color: 0x00ff00});
    var cube = new THREE.Mesh(gemoetry, material);
    cube.position.set(wall.x + wall.width / 2 - 5, wall.y + wall.height / 2 - 5, 0);
    group.add(cube);
    model.createWall({
      x: wall.x + wall.width / 2,
      y: wall.y + wall.height / 2,
      width: wall.width,
      height: wall.height,
    });
  });

  _.forEach(mazeComponents.exitPath, function(wall) {
    var gemoetry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshPhongMaterial({color: 0x0000ff});
    var cube = new THREE.Mesh(gemoetry, material);
    cube.position.set(wall.x + 0.5 - 5, wall.y + 0.5 - 5, -1);
    group.add(cube);
  });

  var gemoetry = new THREE.SphereGeometry(0.125, 32, 32);
  var material = new THREE.MeshPhongMaterial({color: 0xff0000});
  var ball = new THREE.Mesh(gemoetry, material);
  ball.position.set(0.5 - 5, 0.5 - 5, 0);
  group.add(ball);

  scene.add(group);
  camera.position.set(0, 0, 8);

  var keyInput = new KeyInput();

  function render() {
    requestAnimationFrame(render);

    var bpos = ball2.GetPosition();
    ball.position.x = bpos.get_x() / 10 - 5;
    ball.position.y = bpos.get_y() / 10 - 5;

    if (keyInput.isDown(keyInput.LEFT)) {
      model.tiltLeft();
      group.rotation.y = -Math.PI / 20;
    } else if (keyInput.isDown(keyInput.RIGHT)) {
      model.tiltRight();
      group.rotation.y = Math.PI / 20;
    } else {
      model.releaseHorizontalTilt();
      group.rotation.y = 0;
    }
    if (keyInput.isDown(keyInput.UP)) {
      model.tiltUp();
      group.rotation.x = -Math.PI / 20;
    } else if (keyInput.isDown(keyInput.DOWN)) {
      model.tiltDown();
      group.rotation.x = Math.PI / 20;
    } else {
      model.releaseVerticalTilt();
      group.rotation.x = 0;
    }

    model.step(1/60);

    renderer.render(scene, camera);
  }

  render();
});
