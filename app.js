#!/usr/bin/env node
'use strict';

var path = require('path');
var gulp = require('gulp');
var args = require('yargs').argv;
require('shelljs/global');

var cwd_dir = process.cwd();
var PATHS={
    basePath:'./',
    srcPath:path.join(__dirname),
    distPath:path.join(cwd_dir, 'fm-build-quickstart')
};

(function(){
    exec("echo please wait ...");
    return gulp.src([path.join(PATHS.srcPath, '**'), path.join(PATHS.srcPath, '.gitignore'), path.join(PATHS.srcPath, '.npmignore'), '!'+path.join(PATHS.srcPath, 'node_modules/**')])
        .pipe(gulp.dest(PATHS.distPath));
})();
