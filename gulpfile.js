'use strict';


//-- Modules --//

var gulp = require('gulp');
var watch = require('gulp-watch');
var prefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rigger = require('gulp-rigger');
var jade = require('gulp-jade');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var browserSync = require("browser-sync");
var mainBowerFiles = require('main-bower-files');
var flatten = require('gulp-flatten');
var filter = require('gulp-filter');
var rename = require('gulp-rename');
var newer = require('gulp-newer');
var inject = require('gulp-inject');
var runSequence = require('run-sequence');
var del = require('del');


//-- Settings --//

var reload = browserSync.reload;
var serverConfig = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Gulp Development WebServer",
    open: false	// stop the browser from automatically opening
};
var serverConfigProd = {
    server: {
        baseDir: "./build-prod"
    },
    tunnel: false,
    host: 'localhost',
    port: 9001,
    logPrefix: "Gulp Production WebServer",
    open: false
};


//-- Paths --//

var rootBuild = './build';
var rootBuildProd = './build-prod';
var rootSrc = './src';
var path = {
    build: {
        html: rootBuild,
        jade: rootBuild,
        js: rootBuild + '/js',
        css: rootBuild + '/css',
        img: rootBuild + '/img',
        fonts: rootBuild + '/vendor/fonts',
        bower: rootBuild + '/vendor'
    },
    buildProd: {
        html: rootBuildProd,
        jade: rootBuildProd,
        js: rootBuildProd + '/js',
        css: rootBuildProd + '/css',
        img: rootBuildProd + '/img',
        fonts: rootBuildProd + '/vendor/fonts',
        bower: rootBuildProd + '/vendor'
    },
    src: {
        html: rootSrc + '/*.html',
        jade: [rootSrc + '/html/*.jade', '!' + rootSrc + '/html/_*.jade'],
        js: rootSrc + '/js/main.js',
        style: [rootSrc + '/styles/*.scss', '!' + rootSrc + '/styles/_*.scss'],
        img: rootSrc + '/img/**/*.*',
        fonts: rootSrc + '/fonts/**/*.*'
    },
    watch: {
        jade: rootSrc + '/html/**/*.jade',
        js: rootSrc + '/js/**/*.js',
        style: rootSrc + '/styles/**/*.scss',
        img: rootSrc + '/img/**/*.*',
        fonts: rootSrc + '/fonts/**/*.*'
    }
};


//-- Gulp Tasks --//

// clean
gulp.task('clean', function (cb) {
    return del(rootBuild, cb);
});
gulp.task('clean:prod', function (cb) {
    return del(rootBuildProd, cb);
});

// images
gulp.task('images', function () {
    return gulp.src(path.src.img)
        .pipe(newer(path.build.img))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});
gulp.task('images:prod', function () {
    return gulp.src(path.src.img)
        //.pipe(newer(path.build.img))
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest(path.buildProd.img));
});

// bower
gulp.task('bower', function () {
    var jsFilter = filter('*.js');
    var cssFilter = filter('*.css');
    var fontFilter = filter(['*.eot', '*.woff', '*.svg', '*.ttf']);
    return gulp.src(mainBowerFiles())
        .pipe(jsFilter)
        .pipe(newer(path.build.bower + '/js/'))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(path.build.bower + '/js/'))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(newer(path.build.bower + '/css'))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(path.build.bower + '/css'))
        .pipe(cssFilter.restore())
        .pipe(fontFilter)
        .pipe(newer(path.build.bower + '/fonts'))
        .pipe(flatten())
        .pipe(gulp.dest(path.build.bower + '/fonts'));
});
gulp.task('bower:prod', function () {
    var jsFilter = filter('*.js');
    var cssFilter = filter('*.css');
    var fontFilter = filter(['*.eot', '*.woff', '*.svg', '*.ttf']);
    return gulp.src(mainBowerFiles())
        .pipe(jsFilter)
        //.pipe(newer(path.buildProd.bower + '/js/'))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(path.buildProd.bower + '/js/'))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        //.pipe(newer(path.buildProd.bower + '/css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(path.buildProd.bower + '/css'))
        .pipe(cssFilter.restore())
        .pipe(fontFilter)
        //.pipe(newer(path.buildProd.bower + '/fonts'))
        .pipe(flatten())
        .pipe(gulp.dest(path.buildProd.bower + '/fonts'));
});

// sass
gulp.task('sass', function () {
    return gulp.src(path.src.style)
        .pipe(newer(path.build.css))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});
gulp.task('sass:prod', function () {
    return gulp.src(path.src.style)
        //.pipe(newer(path.buildProd.css))
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(path.buildProd.css));
});

// fonts
gulp.task('fonts', function () {
    return gulp.src(path.src.fonts)
        .pipe(newer(path.src.fonts))
        .pipe(gulp.dest(path.build.fonts))
});
gulp.task('fonts:prod', function () {
    gulp.src(path.src.fonts)
        //.pipe(newer(path.src.fonts))
        .pipe(gulp.dest(path.buildProd.fonts))
});

// js
gulp.task('js', function () {
    return gulp.src(path.src.js)
        .pipe(newer(path.build.js))
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});
gulp.task('js:prod', function () {
    return gulp.src(path.src.js)
        //.pipe(newer(path.buildProd.js))
        .pipe(rigger())
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(path.buildProd.js));
});

// html
gulp.task('html', function(cb) {
    runSequence(
        'jade',
        'inject',
        cb);
});


// jade
gulp.task('jade', function () {
    return gulp.src(path.src.jade)
        .pipe(jade({pretty: true}))
        .on('error', console.log)
        .pipe(gulp.dest(path.build.jade))
});
gulp.task('jade:prod', function () {
    return gulp.src(path.src.jade)
        .pipe(jade({pretty: false}))
        .on('error', console.log)
        .pipe(gulp.dest(path.buildProd.jade));
});

// inject
gulp.task('inject', function () {
    var bower = gulp.src([path.build.bower + '/**/*.js', path.build.bower + '/**/*.css'], {read: false});
	var sources = gulp.src([path.build.js + '/**/*.js', path.build.css + '/**/*.css'], {read: false});
    return gulp.src(path.build.html + '/**/*.html')
        .pipe(inject(bower, {name: 'bower', relative: true}))
        .pipe(inject(sources, {relative: true}))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});
gulp.task('inject:prod', function () {
	var bower = gulp.src([path.buildProd.bower + '/**/*.js', path.buildProd.bower + '/**/*.css'], {read: false});
	var sources = gulp.src([path.buildProd.js + '/**/*.js', path.buildProd.css + '/**/*.css'], {read: false});
    return gulp.src(path.buildProd.html + '/**/*.html')
		.pipe(inject(bower, {name: 'bower', removeTags: true, relative: true}))
		.pipe(inject(sources, {removeTags: true, relative: true}))
		.pipe(gulp.dest(path.buildProd.html));
});

// web server
gulp.task('webserver', function () {
    browserSync(serverConfig);
});
gulp.task('webserver:prod', function () {
    browserSync(serverConfigProd);
});


//-- Run Tasks --//

// build
gulp.task('build', function(cb) {
    runSequence(
        'clean',
        ['sass', 'js', 'bower', 'images', 'fonts'],
        'html',
        cb);
});

// build for production
gulp.task('build:prod', function(cb) {
    runSequence(
        'clean:prod',
        ['sass:prod', 'jade:prod', 'js:prod', 'bower:prod', 'images:prod', 'fonts:prod'],
        'inject:prod',
        cb);
});

// watch
gulp.task('watch', function () {
    watch([path.watch.style], function () {
        gulp.start('sass');
    });
    watch([path.watch.jade], function () {
        gulp.start('html');
    });
    watch([path.watch.js], function () {
        gulp.start('js');
    });
    watch([path.watch.img], function () {
        gulp.start('images');
    });
    watch([path.watch.fonts], function () {
        gulp.start('fonts');
    });
});

// main tasks
gulp.task('run', ['build', 'webserver', 'watch']);
gulp.task('run:prod', ['build:prod', 'webserver:prod']);
gulp.task('prod', ['build:prod']);

// default task
gulp.task('default', ['run']);
