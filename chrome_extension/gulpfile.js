var gulp = require('gulp')
  , sass = require('gulp-sass')
  , browserify = require('browserify')
  , streamify  = require('gulp-streamify')
  , uglify     = require('gulp-uglify')
  , rename     = require('gulp-rename')
  , source     = require('vinyl-source-stream')
  , sourcemaps = require('gulp-sourcemaps');
 // create a task

gulp.task('sass', function () {
	return gulp.src('style/scss/stylesheet.scss')
		.pipe(sass())
		.pipe(gulp.dest('style/'))
})


gulp.task('browserify', function () {
	var browserifyBundleStream = browserify({"debug": true});

	return browserifyBundleStream
	  .bundle()
	  .pipe(source('src/ctrl/dh.js'))
 	  .pipe(streamify(sourcemaps.init()))
	    .pipe(streamify(uglify()))
          .pipe(streamify(sourcemaps.write()))
	  .pipe(rename('halo.js'))	
	  .pipe(gulp.dest('distro/'));
})


// create watcher

gulp.task('watch', ['sass', 'browserify'], function(){
	gulp.watch('style/scss/*.scss', ['sass']);
	gulp.watch('src/**/*.js', ['browserify']);
})

gulp.task('default', ['sass', 'browserify']);
