/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in gulp/tasks. Any files in that directory get
  automatically required below.
  To add a new task, simply add a new task file that directory.
  gulp/tasks/default.js specifies the default set of tasks to run
  when you run `gulp`.
*/
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    imagemin = require('gulp-imagemin'),
    cache = require ( 'gulp-cache' ),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    replace = require('gulp-replace'),
    webpack = require("webpack"),
    runSequence = require('run-sequence'),
    header = require('gulp-header'),
    gcallback = require('gulp-callback');

var PATHS={
  basePath:'./',
  htmlPath:'html/',
  srcPath:'assets/js/src/',
  cssPath:'assets/css/',
  distPath:'dist/'
};


function buildHeader () {
  var pkg = require('./package.json');
  var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @author <%= pkg.author %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' * @time '+ webpackConfig.getTime,
    ' */',
    ''
  ].join('\n');
  return header(banner, { pkg: pkg });
}

//watch
gulp.task('watch', function() {
  gulp.watch(PATHS.srcPath+'*.js', function(event){
      webpackConfig.refreshEntry();
      gulp.start('release');
  });
  gulp.watch(PATHS.cssPath+'*.css', function(event){
      gulp.start('build-css');
  });
  gulp.watch(PATHS.basePath+'html/*.html', function(event){
      gulp.start('build-html');
  });
});

//release
var webpackConfig = require('./webpack.config.js');
gulp.task("release", function(callback) {
    webpack(webpackConfig, function(err, stats) {
      if(err) throw new gutil.PluginError("release:build", err);
      gutil.log("[release:build]", stats.toString({
        colors: true
      }));
      callback();
    });
});

//imagemin
gulp.task('imagemin', function(){
  return gulp.src(PATHS.distPath+'assets/img/*.{png,jpg,gif,ico}')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    //.pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(PATHS.distPath+'assets/img/min'));
    //.pipe(gcallback(function() {console.log('imagemin success');}))
})

//clean
gulp.task('clean', function() {  
  return gulp.src([PATHS.distPath+'*'], {read: false})
    .pipe(clean());
});

//copy-themes
gulp.task('copy-themes', () => {
 return  gulp.src('assets/3rd/semantic/themes/**')
  .pipe(gulp.dest(PATHS.distPath+'assets/css/themes'))
});
//copy-img
gulp.task('copy-img', () => {
 return  gulp.src('assets/img/*')
  .pipe(gulp.dest(PATHS.distPath+'assets/img'))
});

//build-css
gulp.task('build-css', function() {
    return gulp.src([PATHS.cssPath+'*.css','assets/3rd/semantic/semantic.min.css'])
        .pipe(concat('style.css'))//merge all css to style.css
        .pipe(buildHeader())
        .pipe(gulp.dest(PATHS.distPath+'assets/css'));
});
// build-html
gulp.task('build-html', function() {
   return gulp.src(PATHS.htmlPath+'**/*.html')
      .pipe(replace(/(dist\/)(assets\/js\/)(.*)(\.js)/g, '$2$3$4'))
      .pipe(replace(/(dist\/)(assets\/css\/)(.*)(\.css)/g, '$2$3$4'))
      .pipe(gulp.dest(PATHS.distPath+'html'));
});
// build-html-index
gulp.task('build-html-index', function() {
   return gulp.src(PATHS.basePath+'index.html')
      .pipe(gulp.dest(PATHS.distPath));
});
// build-data
gulp.task('build-data', function() {
   return gulp.src([PATHS.basePath+'data/**'])
     .pipe(gulp.dest(PATHS.distPath+'data'));
});

//minifycss
gulp.task('minifycss', function() {
    return gulp.src(PATHS.distPath+'assets/css/*.css')
        .pipe(minifycss())//uglify
        .pipe(rename({basename: 'style.min'}))//rename
        .pipe(rev())//build name-md5.css
        .pipe(buildHeader())
        .pipe(gulp.dest(PATHS.distPath+'assets/css'))//output
        .pipe(rev.manifest())// build rev-manifest.json
        .pipe(gulp.dest(PATHS.distPath+'assets/css'));
});

//minifyjs
gulp.task('minifyjs', function() {
    return gulp.src(PATHS.distPath+'assets/js/*.js')
        .pipe(uglify())//uglify
        .pipe(rename(function (path) {
            path.basename += '.min';
          }))//rename
        .pipe(rev())//build name-md5.js
        .pipe(buildHeader())
        .pipe(gulp.dest(PATHS.distPath+'assets/js'))//output
        .pipe(rev.manifest())// build rev-manifest.json
        .pipe(gulp.dest(PATHS.distPath+'assets/js'));
});

 // js,css add .min
gulp.task('build-html-min', function() {
   return gulp.src(PATHS.htmlPath+'**/*.html')
     .pipe(replace(/(dist\/)(assets\/js\/)(.*)(\.js)/g, '$2$3.min$4'))
     .pipe(replace(/(dist\/)(assets\/css\/)(.*)(\.css)/g, '$2$3.min$4'))
     .pipe(gulp.dest(PATHS.distPath+'html'));
});
// html add md5 reference
gulp.task('md5html', function() {
  return gulp.src([PATHS.distPath+'assets/css/*.json', PATHS.distPath+'assets/js/*.json', PATHS.distPath+'html/*.html'])
    .pipe(revCollector())
    .pipe(gulp.dest(PATHS.distPath+'html'));
});

//clean-dev-css
gulp.task('clean-dev-css', function() {  
  return gulp.src([PATHS.distPath+'assets/css/*.css','!'+PATHS.distPath+'assets/css/*.min.css'], {read: false})
    .pipe(clean());
});
//clean-dev-js
gulp.task('clean-dev-js', function() {  
  return gulp.src([PATHS.distPath+'assets/js/*.js','!'+PATHS.distPath+'assets/js/*.min.js'], {read: false})
    .pipe(clean());
});
//clean-min
gulp.task('clean-min', function() {  
  return gulp.src([PATHS.distPath+'assets/**/rev-*.json',PATHS.distPath+'assets/css/*.min.css', PATHS.distPath+'assets/js/*.min.js'], {read: false})
    .pipe(clean());
});

//deploy
gulp.task('deploy', function() {
  runSequence('clean','release','copy-themes','copy-img','build-css','build-data','build-html-index',['minifycss','minifyjs'],'build-html-min','md5html','clean-dev-css','clean-dev-js');
});

//compile
gulp.task('compile', function() {
  runSequence('clean-min','release','copy-themes','copy-img','build-css','build-data','build-html-index','build-html');
});

//change to development model
gulp.task('dev', function() {
  runSequence('compile','watch');
});

//default
gulp.task('default',['watch']);