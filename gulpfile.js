'use strict';

const gulp = require('gulp');
const del = require('del');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const plugins = require('gulp-load-plugins')();
const $ = require('gulp-load-plugins')({ 
  pattern: ['gulp-*'],
  rename:{
    'gulp-minify-css':'minifyCSS'
  }
 });
// const watchify = require('watchify');
// const getBundleName = function () {
//   const version = require('./package.json').version;
//   const name = require('./package.json').name;
//   return version + '.' + name + '.' + 'min';
// };

gulp.task('browser-sync',  ['build'],  function() {
  browserSync({
    server: {
      baseDir: './',
      directory: false
    },
    open: false
  });
});

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

// gulp.task('browserify',  ['transpile'], function() {

//   const bundler = watchify(browserify({
//     entries: ['./build/js/app.js'],
//     debug: true
//   }));

//   const bundle = function() {
//     return bundler
//       .bundle()
//       .pipe(source(getBundleName() + '.js'))
//       .pipe(buffer())
//       .pipe($.sourcemaps.init({loadMaps: true}))
//         // Add transformation tasks to the pipeline here.
//       // .pipe($.uglify())
//       .pipe($.sourcemaps.write('./'))
//       .pipe(gulp.dest('./dist/js/'))
//       .pipe($.size());
//   };

//   return bundle();
// });

gulp.task('clean', function(cb) {
  del(['dist','build'], cb);
});
 
gulp.task('styles', function () {
    return gulp.src('src/css/styles.less')
        .pipe($.less())
        .on('error', handleError)
        .pipe($.autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe($.minifyCSS({keepSpecialComments:0}))
        .pipe(gulp.dest('dist/css'))
        .pipe(reload({stream:true}))
        .pipe($.size());
});

gulp.task('scripts',['transpile'],function(){
  return gulp.src('build/**/*.js')
      .pipe(gulp.dest('dist'))
      .pipe(reload({stream:true}))
      .pipe($.size());
})

gulp.task('transpile', function () {
    return gulp.src('src/js/**/*.js')
        .pipe($.babel())
        .pipe(gulp.dest('build/js'));
});

gulp.task('serve', ['build', 'browser-sync'],  function() {
});

gulp.task('build', ['styles','scripts']);

gulp.task('default', ['clean'], function () {
    gulp.start(['build', 'browser-sync']);
    gulp.watch('src/**/*.js', ['scripts', reload]);
    gulp.watch('src/**/*.less', ['styles']);
});