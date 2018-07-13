'use strict';

var
		gulp         = require('gulp'),
		browserSync  = require('browser-sync'),
    	reload 		 = browserSync.reload,
        watch 		 = require('gulp-watch'),

        rigger       = require('gulp-rigger'),
        concat       = require('gulp-concat'),
		uglify       = require('gulp-uglify'),

        sass         = require('gulp-sass'),
        autoprefixer = require('gulp-autoprefixer'),
        cssmin 		 = require('gulp-minify-css'),

		imagemin	 = require('gulp-imagemin'),

        handlebars   = require('gulp-compile-handlebars'),
    	layouts      = require('handlebars-layouts'),
		plumber      = require('gulp-plumber');
		//psi 				 = require('psi');


layouts.register(handlebars.Handlebars);

var route = {
    build: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'dev/views/*.html',
        js: 'dev/js/**/*.js',
        css: 'dev/style/**/*.scss',
        style: 'dev/style/main.scss',
        img: 'dev/img/**/*.*',
        fonts: 'dev/fonts/**/*.*'
    },
    watch: {
        html: 'dev/**/*.html',
        js: 'dev/js/**/*.js',
        style: 'dev/style/**/*.scss',
        img: 'dev/img/**/*.*'
    },
    clean: './dist'
};

var config = {
    server: {
        baseDir: "./dist"
    },
    tunnel: false,
    port: 9000,
    logPrefix: "Front_dev"
};

gulp.task('html', function () {
    gulp.src(route.src.html)
        .pipe(handlebars({}, {
            batch: ['./dev/views/partials']
        }))
        .pipe(gulp.dest(route.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('style', function () {
    gulp.src(route.src.style)
        .pipe(plumber())
        .pipe(sass())
        .pipe(cssmin())
        .pipe(autoprefixer())
        .pipe(gulp.dest(route.build.css))
        .pipe(reload({stream: true}));

    gulp.src(route.src.css)
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(gulp.dest(route.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('js', function () {
    gulp.src(route.src.js)
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest(route.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('image', function () {
    gulp.src(route.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        }))
        .pipe(gulp.dest(route.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts', function() {
    gulp.src(route.src.fonts)
        .pipe(gulp.dest(route.build.fonts))
});

gulp.task('build', [
    'html',
    'js',
    'style',
    'fonts',
    'image'
]);

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('watch', function () {
    watch([route.watch.html], function (event, cb) {
        gulp.start('html');
    });
    watch([route.watch.style], function (event, cb) {
        gulp.start('style');
    });
    watch([route.watch.js], function (event, cb) {
        gulp.start('js');
    });

});


gulp.task('default', ['build', 'webserver', 'watch']);