'use strict';

require.config({
  baseUrl: 'js',
  paths: {
    three: '../lib/three.min',
    lodash: '../lib/lodash.min',
  },
  shim: {
    three: {
      exports: 'THREE',
    },
  },
});

require([
  'three',
  'lodash',
  'maze/creator',
], function(THREE, _, maze) {

  var canvas = document.getElementById('canvas');

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setSize(window.innerWidth, window.innerHeight);

  var light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(4.5, 4.5, 10);
  scene.add(light);

  var mazeComponents = maze.create();

  _.forEach(mazeComponents.walls, function(wall) {
    var gemoetry = new THREE.BoxGeometry(wall.width, wall.height, 1);
    var material = new THREE.MeshPhongMaterial({color: 0x00ff00});
    var cube = new THREE.Mesh(gemoetry, material);
    cube.position.set(wall.x + wall.width / 2, wall.y + wall.height / 2, 0);
    scene.add(cube);
  });

  var gemoetry = new THREE.SphereGeometry(0.5, 32, 32);
  var material = new THREE.MeshPhongMaterial({color: 0xff0000});
  var ball = new THREE.Mesh(gemoetry, material);
  ball.position.set(0.5, 0.5, 0);
  scene.add(ball);
  console.dir(ball);

  camera.position.set(4.5, 4.5, 10);

  window.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
      case 37:
        --ball.position.x;
        break;
      case 38:
        ++ball.position.y;
        break;
      case 39:
        ++ball.position.x;
        break;
      case 40:
        --ball.position.y;
        break;
    }
  }, false);

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    ball.rotation.x += 0.01;
    ball.rotation.y += 0.01;
  }

  render();
});
