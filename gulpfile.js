'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('gulp', function() {
  return gulp.src('gulpfile.js')
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter('default'));
});

gulp.task('js', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter('default'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('assets', function() {
  return gulp.src('src/img/*')
    .pipe(gulp.dest('dist/img'));
});

gulp.task('downloadDependencies', function() {
  plugins.download([
    'http://threejs.org/build/three.min.js',
    'https://raw.githubusercontent.com/lodash/lodash/2.4.1/dist/lodash.min.js',
    'https://raw.githubusercontent.com/kripken/box2d.js/master/box2d.js',
    'http://requirejs.org/docs/release/2.1.14/minified/require.js',
  ]).pipe(gulp.dest('dist/lib'));
});

gulp.task('connect', function() {
  plugins.connect.server({
    root: 'dist',
    livereload: true,
    port: 8000,
  });
});

gulp.task('watch', function() {
  gulp.watch('gulpfile.js', ['gulp']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/*.html', ['html']);
  gulp.watch('src/img/*', ['assets']);
  gulp.watch('dist/**', function() {
    gulp.src('dist/index.html')
      .pipe(plugins.connect.reload());
  });
});

gulp.task('jsdoc', function() {
  gulp.src('src/js/**/*.js')
    .pipe(plugins.jsdoc.parser())
    .pipe(plugins.jsdoc.generator('doc', {}, {
      'showPrivate': true,
      'cleverLinks': true,
    }));
});

gulp.task('default', [
  'downloadDependencies',
  'js',
  'html',
  'assets',
  'connect',
  'watch',
]);

gulp.task('build', [
  'downloadDependencies',
  'js',
  'html',
  'assets',
]);
