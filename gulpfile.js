var gulp = require('gulp'),
    csso = require('gulp-csso'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    nodemon = require('gulp-nodemon'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    env = require('gulp-env');

gulp.task('styles', function() {
    var styles = [
        'client/scss/**/*.scss',
        '!client/scss/**/_*.scss'
    ];

    return gulp.src(styles)
        .pipe(sourcemaps.init())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(sass().on('error', sass.logError))
        .pipe(csso())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/css/'));
});

gulp.task('javascript', function() {
    var components = [
        'client/js/functions.js',
        'client/js/templating.js',
        'client/js/chathandler.js',
        'client/js/emoticonhandler.js',
        'client/js/twitchchat.js',
        'client/js/main.js'
    ];

    return gulp.src(components)
        .pipe(sourcemaps.init())
        .pipe(uglify({
            'mangle': true
        }))
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js/'));
});

gulp.task('vendors', function() {
    var vendors = [
        'bower_components/jquery/dist/jquery.js',
        'bower_components/moment/moment.js',
        'bower_components/socket.io-client/socket.io.js'
    ];

    return gulp.src(vendors)
        .pipe(sourcemaps.init())
        .pipe(uglify({
            'mangle': true
        }))
        .pipe(concat('vendors.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js/'));
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
    gulp.watch('client/**/*', ['styles', 'javascript']);
});
