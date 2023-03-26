(function() {

  'use strict';

  // Include Gulp & Plugins
  var gulp = require('gulp');
  var sass = require('gulp-sass')(require('sass'));
  var autoprefixer = require('gulp-autoprefixer');
  var plumber = require('gulp-plumber');
  var gutil = require('gulp-util');
  var rename = require('gulp-rename');
  var replace = require('gulp-replace');
  var size = require('gulp-size');
  var zip = require('gulp-zip');
  var fs = require('fs');

  // Set the compiler to use Dart Sass instead of Node Sass
  sass.compiler = require('dart-sass');

  var onError = function( err ) {
    console.log('An error occurred:', gutil.colors.magenta(err.message));
    gutil.beep();
    this.emit('end');
  };

  // SASS
  gulp.task('sass', function (done) {
    return gulp.src('./assets/sass/*.scss')
      .pipe(plumber({ errorHandler: onError }))
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(rename({suffix: '-min'}))
      .pipe(gulp.dest('./assets/css'))
      .pipe(size())
      done();
  });

  // inlineCSS
  gulp.task('inlinecss', function(done) {
    return gulp.src(['partials/inline-css.hbs'])
    .pipe(replace('@@compiled_css', fs.readFileSync('assets/css/style-min.css')))
    .pipe(gulp.dest('partials/compiled'))
    done();
  });

  // Watch
  gulp.task('watch', function() {
    gulp.watch('./assets/sass/**/*.scss', gulp.series('build_css'));
  });

  gulp.task(
    'build_css',
    // gulp.series('sass', 'inlinecss', 'inlinecss-rtl')
    gulp.series('sass', 'inlinecss')
  );

  gulp.task(
    'build',
    // gulp.series('build_css', 'js')
    gulp.series('build_css')
  );

  gulp.task('zip', function () {
    return gulp.src([
      './**',
      '!node_modules/**',
      '!bower_components/**',
      '!.git/**',
      '!.DS_Store'
    ], { dot: true })
    .pipe(zip('mangwon.zip'))
    .pipe(gulp.dest('../'))
    done();
  });

  gulp.task(
    'default',
    gulp.series('build', 'watch')
  );
})();