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
  'maze',
], function(THREE, maze) {

  var canvas = document.getElementById('canvas');

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setSize(window.innerWidth, window.innerHeight);

  var light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(0, 0, 1);
  scene.add(light);

  var gemoetry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshPhongMaterial({color: 0x00ff00});
  var cube = new THREE.Mesh(gemoetry, material);
  scene.add(cube);

  gemoetry = new THREE.BoxGeometry(1, 1, 1);
  var cube2 = new THREE.Mesh(gemoetry, material);
  cube2.position.set(2, 0, 0);
  scene.add(cube2);

  camera.position.z = 5;

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    cube2.rotation.x += 0.01;
    cube2.rotation.y += 0.01;
  }

  render();

  maze.generate();
});
