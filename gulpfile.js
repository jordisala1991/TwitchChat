var gulp = require('gulp');
var csso = require('gulp-csso');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('styles', function() {
    return gulp.src('public/css/*.css')
        .pipe(csso())
        .pipe(concat('styles.min.css'))
        .pipe(gulp.dest('public/css/dest/'));
});

gulp.task('javascript', function() {
    return gulp.src('public/js/components/*.js')
        .pipe(uglify({
            'mangle': true
        }))
        .pipe(concat('script.min.js'))
        .pipe(gulp.dest('public/js/'));
});

gulp.task('vendors', function() {
    var vendors = [
        'bower_components/jquery/dist/jquery.js',
        'bower_components/moment/moment.js',
        'bower_components/socket.io-client/socket.io.js'
    ];

    return gulp.src(vendors)
        .pipe(uglify({
            'mangle': true
        }))
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('public/js/'));
});

gulp.task('default', ['styles', 'javascript', 'vendors'], function() {
    gulp.watch('public/css/*.css', ['styles']);
    gulp.watch('public/js/components/*.js', ['javascript']);
});
