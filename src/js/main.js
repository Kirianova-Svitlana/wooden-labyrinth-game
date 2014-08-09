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

  var renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setSize(window.innerWidth, window.innerHeight);

  var light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(4.5, 4.5, 10);
  scene.add(light);

  var mazeComponents = maze.create();

  var model = new Model();
  var ball2 = model.createBall({radius: 0.125, x: 0, y: 0});

  _.forEach(mazeComponents.walls, function(wall) {
    var gemoetry = new THREE.BoxGeometry(wall.width, wall.height, 1);
    var material = new THREE.MeshPhongMaterial({color: 0x00ff00});
    var cube = new THREE.Mesh(gemoetry, material);
    cube.position.set(wall.x + wall.width / 2, wall.y + wall.height / 2, 0);
    scene.add(cube);
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
    cube.position.set(wall.x + 0.5, wall.y + 0.5, -1);
    scene.add(cube);
  });

  var gemoetry = new THREE.SphereGeometry(0.125, 32, 32);
  var material = new THREE.MeshPhongMaterial({color: 0xff0000});
  var ball = new THREE.Mesh(gemoetry, material);
  ball.position.set(0.5, 0.5, 0);
  scene.add(ball);

  camera.position.set(5, 5, 8);

  var keyInput = new KeyInput();

  function render() {
    requestAnimationFrame(render);
    model.step(1/60);
    var bpos = ball2.GetPosition();
    ball.position.x = bpos.get_x() / 10;
    ball.position.y = bpos.get_y() / 10;
    if (keyInput.isDown(keyInput.LEFT)) {
      --ball.position.x;
    }
    if (keyInput.isDown(keyInput.UP)) {
      ++ball.position.y;
    }
    if (keyInput.isDown(keyInput.RIGHT)) {
      ++ball.position.x;
    }
    if (keyInput.isDown(keyInput.DOWN)) {
      --ball.position.y;
    }
    renderer.render(scene, camera);
  }

  render();
});
