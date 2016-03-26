var gulp = require('gulp');
var csso = require('gulp-csso');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var nodemon = require('gulp-nodemon');
var env = require('gulp-env');

gulp.task('styles', function() {
    return gulp.src('public/css/*.css')
        .pipe(csso())
        .pipe(concat('styles.min.css'))
        .pipe(gulp.dest('public/'));
});

gulp.task('javascript', function() {
    var components = [
        'public/js/functions.js',
        'public/js/templating.js',
        'public/js/chathandler.js',
        'public/js/emoticonhandler.js',
        'public/js/twitchchat.js',
        'public/js/main.js'
    ];

    return gulp.src(components)
        .pipe(uglify({
            'mangle': true
        }))
        .pipe(concat('script.min.js'))
        .pipe(gulp.dest('public/'));
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
        .pipe(gulp.dest('public/'));
});

gulp.task('nodemon', function(callback) {
    var called = false;

    env({
        file: '.env',
        type: 'ini'
    });

    nodemon({
        script: 'server/server.js',
        watch: ['.env', 'server/']
    }).on('start', function() {
        if (!called) {
            called = true;
            callback();
        }
    });
});

gulp.task('build', ['styles', 'javascript', 'vendors']);

gulp.task('default', ['build', 'nodemon'], function() {
    gulp.watch('public/css/**/*.css', ['styles']);
    gulp.watch('public/js/**/*.js', ['javascript']);
});
