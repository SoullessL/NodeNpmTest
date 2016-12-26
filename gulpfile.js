var gulp = require('gulp');  
var eslint = require('gulp-eslint');

gulp.task('lint', function() {  
  return gulp.src(['./script/*.js','!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('default', ['lint'], function () {
    // This will only run if the lint task is successful...
});
