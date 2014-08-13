# Wooden Labyrinth Game

Author: Daniel "MaTachi" Jonsson  
License: [MIT License](LICENSE.md)

## Prerequisites

Install npm and gulp on a Debian based system (Ubuntu for example):

    $ sudo apt-get install nodejs
    $ sudo npm install -g gulp
    $ sudo chown -R `whoami`:`whoami` ~/.npm ~/tmp

## Set up

Install development dependencies (gulp.js) and game dependencies (three.js,
require.js, etc):

    $ npm install

## Build development version of the game

Watch for changes in the text files (JavaScript, HTML, etc) and perform
continuous building:

    $ gulp

## Build production version of the game

    $ gulp build

This does the same as `gulp`, but with more minimization, cleaning and without
the continuous building.

## Run the game

The built game is available in the directory `dist/`.

## Build documentation

    $ gulp jsdoc

## Credits

The app depends on the following JavaScript libraries:

* [Lo-Dash](http://lodash.com/) licensed under the [MIT
  License](https://github.com/lodash/lodash/blob/master/LICENSE.txt).
* [three.js](http://threejs.org/) licensed under the [MIT
  License](https://github.com/mrdoob/three.js/blob/master/LICENSE).
* [RequireJS](http://requirejs.org/) licensed under the [MIT License or the
  "new" BSD License](https://github.com/jrburke/requirejs/blob/master/LICENSE).

The following art is being used:

* [wood1.png](src/img/wood1.png) from
  [opengameart.org/node/8721](http://opengameart.org/node/8721), made by
  [Luke.RUSTLTD](http://opengameart.org/users/lukerustltd) and licensed under
  [CC0](http://creativecommons.org/publicdomain/zero/1.0/).
* [wood2.png](src/img/wood2.png) from
  [opengameart.org/node/8084](http://opengameart.org/node/8084), made by
  [qubodup](http://opengameart.org/users/qubodup) and licensed under
  [CC0](http://creativecommons.org/publicdomain/zero/1.0/).
