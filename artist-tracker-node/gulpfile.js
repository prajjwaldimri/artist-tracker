var gulp = require('gulp');

// Gulp Plugins
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');

// Convert and minify sass files
gulp.task('sass', function () {
  return gulp
    .src('./src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/css'));
});

// Minify JS files
gulp.task('uglify', function () {
  return gulp.src('./src/js/*.js').pipe(uglify()).pipe(gulp.dest('./dist/js'));
});

gulp.task('imgmin', function () {
  gulp.src('./src/img/*').pipe(imagemin()).pipe(gulp.dest('./dist/img'));
});

// Watch files for changes
gulp.task('watch', function () {
  gulp.watch('./src/js/*.js', ['uglify']);
  gulp.watch('./src/sass/*.scss', ['sass']);
  gulp.watch('./src/img/*.*', ['imgmin']);
});

// Default Task that runs all other tasks
gulp.task('default', ['sass', 'uglify', 'imgmin', 'watch']);
