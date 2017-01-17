"use strict";

var gulp = require("gulp");
var nodemon = require("gulp-nodemon");
var gulpif = require('gulp-if');
var size    = require('gulp-size');
var htmlmin = require('gulp-htmlmin');

var src = {
  views   : 'public/**/*.html',
  favicon : 'public/favicon.ico'
};

var output = {
  dist    : 'dist'
};

gulp.task('favicon', function() {
  return gulp.src(src.favicon)
    .pipe(gulp.dest(output.dist));
});

gulp.task('views', function() {
  return gulp.src(src.views)
    .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest(output.dist));
});

gulp.task('build', ['views', 'favicon'], function() {
  return gulp.src('dist/**/*')
    .pipe(size({title: 'build', gzip: true}));
});

gulp.task('devServer', function () {
    nodemon({
        script: 'server/development.js',
        ext: 'js',
        env: { 'NODE_ENV': 'development' }
    });
});

gulp.task('serve', ['build'], function () {
    nodemon({
        script: 'server/production.js',
        ext: 'js',
        env: { 'NODE_ENV': 'production' }
    });
});