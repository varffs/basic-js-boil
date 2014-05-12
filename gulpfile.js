var gulp = require('gulp'),
	connect = require('gulp-connect'),

	stylus = require('gulp-stylus');
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),

    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),

    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),

    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),

	destinations = {
		js: 'build/js/',
		docs: 'build/',
		css: 'build/css/',
		images: 'build/img/'
	};

/* SERVER */
gulp.task('connect', function() {
  connect.server({
    root: 'build',
    port: 8008,
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./build/*.html')
    .pipe(connect.reload());
});

/* STYLES */
gulp.task('styles', function() {
  return gulp.src('src/styles/main.styl')
    .pipe(stylus())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(destinations.css))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(destinations.css))
    .pipe(connect.reload())
    .pipe(notify({ message: 'Styles task complete' }));
});

/* SCRIPT */
gulp.task('script', function() {
  return gulp.src('src/scripts/main.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest(destinations.js))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(destinations.js))
    .pipe(connect.reload())
    .pipe(notify({ message: 'Script task complete' }));
});

/* LIB */
gulp.task('lib', function() {
  return gulp.src('src/libs/*.js')
  	.pipe(concat('lib.js'))
    .pipe(gulp.dest(destinations.js))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(destinations.js))
    .pipe(connect.reload())
    .pipe(notify({ message: 'Lib task complete' }));
});

/* IMAGES */
gulp.task('images', function () {
    return gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest(destinations.images));
});

/* WATCH */
gulp.task('watch', function() {

  gulp.watch('src/styles/main.styl', ['styles']);
  gulp.watch('src/scripts/main.js', ['script']);
  gulp.watch('src/images/*', ['images']);
  gulp.watch(['./build/*.html'], ['html']);

});

/*DEFAULT TASK*/
gulp.task('default', ['connect', 'watch']);
gulp.task('init', ['styles', 'script', 'lib', 'images']);