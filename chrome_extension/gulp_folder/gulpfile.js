var gulp = require('gulp')
  , sass = require('gulp-sass')
 // create a task

gulp.task('sass', function () {
	return gulp.src('../style/scss/stylesheet.scss')
		.pipe(sass())
		.pipe(gulp.dest('../style'))
})

