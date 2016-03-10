'use strict';

var path = require('path'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    replace = require('gulp-replace'),
    uglify = require('gulp-uglify');

function statik() {
    var args = [ __dirname, 'static' ];

    for(var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }

    return path.resolve.apply(null, args);
}

function vendor() {
    var args = [ 'vendor' ];

    for(var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }

    return statik.apply(null, args);
}

gulp.task('build', [ 'concat', 'copy' ]);
gulp.task('concat', [ 'concat:css', 'concat:js' ]);
gulp.task('copy', [ 'copy:fonts' ]);

gulp.task('concat:css', function() {
    return gulp.src([
            vendor('bootswatch-dist', 'css', 'bootstrap.css'),
            statik('css', '**', '*.css'),
        ])
        .pipe(concat('app.css'))
        .pipe(replace(/\/\*[#@] sourceMappingURL=[^\s'"]+ \*\//, ''))
        .pipe(cssmin())
        .pipe(gulp.dest(path.resolve(__dirname, 'public', 'css')));
});

gulp.task('concat:js', function() {
    return gulp
        .src([
            vendor('jquery', 'dist', 'jquery.js'),
            vendor('bootswatch-dist', 'js', 'bootstrap.js'),
            statik('js', '**', '*.js'),
        ])
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.resolve(__dirname, 'public', 'js')));
});

gulp.task('copy:fonts', function() {
    return gulp.src([
            vendor('bootswatch-dist', 'fonts', '*'),
        ])
        .pipe(gulp.dest(path.resolve(__dirname, 'public', 'fonts')));
});
