var gulp = require('gulp')
  , sass = require('gulp-sass')
 // create a task

gulp.task('sass', function () {
	return gulp.src('../chrome_extension/style/scss/stylesheet.scss')
		.pipe(sass())
		.pipe(gulp.dest('../chrome_extension/style'))
})

// create watcher

gulp.task('watch', ['sass'], function(){
	gulp.watch('../chrome_extension/style/scss/*.scss', ['sass'])
})
