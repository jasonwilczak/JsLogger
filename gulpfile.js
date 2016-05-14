var gulp = require('gulp');
var uglify = require('gulp-uglify');
var transpile = require('gulp-babel-transpiler');
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');


gulp.task('tests',function(){
    gutil.log('Executing tests...');
});
gulp.task('cleanRelease',function(){
    gutil.log('Cleaning up release...');
    return gulp.src('./release/*.*',{read:false})
    .pipe(clean());
});
gulp.task('cleanStage',function(){
    gutil.log('Cleaning up stage...');    
    return gulp.src('./stage/*.js',{read:false})
    .pipe(clean());
});
gulp.task('cleanAll',['cleanRelease','cleanStage'],function(){});
gulp.task('release',['tests','cleanAll'],function(){
    gutil.log('Transpiling and Compressing...');
    gulp.src('./dev/*.js')
    .pipe(sourcemaps.init())
    .pipe(transpile())
    .pipe(uglify())
    .pipe(rename({extname:'.min.js'}))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./release'));
});
