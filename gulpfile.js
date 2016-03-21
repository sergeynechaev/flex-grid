'use strict';

/* Modules */
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
var del = require('del');


/* Settings */
var	reload = browserSync.reload;
var serverConfig = {
	server: {
		baseDir: "./build"
	},
	tunnel: false,
	host: 'localhost',
	port: 9000,
	logPrefix: "Gulp WebServer",
	open: false	// stop the browser from automatically opening
};

/* Paths */
var rootBuild = './build';
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
	    src: {
	        html: rootSrc + '/*.html',
	        jade: [rootSrc + '/html/*.jade', '!'+ rootSrc + '/html/_*.jade'],
	        js: rootSrc + '/js/main.js',
	        style: [rootSrc + '/styles/*.scss', '!'+ rootSrc + '/styles/_*.scss'],
	        img: rootSrc + '/img/**/*.*',
	        fonts: rootSrc + '/fonts/**/*.*'
	    },
	    watch: {
	        html: rootSrc + '/**/*.html',
	        jade: rootSrc + '/html/**/*.jade',
	        js: rootSrc + '/js/**/*.js',
	        style: rootSrc + '/styles/**/*.scss',
	        img: rootSrc + '/img/**/*.*',
	        fonts: rootSrc + '/fonts/**/*.*'
	    }
};


/* Gulp Tasks */

// clean
gulp.task('clean', function (cb) { del( rootBuild, cb ); });


// html
gulp.task('jade', function() {
    gulp.src(path.src.jade)
        .pipe(jade({
            pretty: true
        }))  
        .on('error', console.log) 
    .pipe(gulp.dest(path.build.jade)) 
    .pipe(reload({stream: true}));
}); 

// images
gulp.task('images', function() {
  return gulp.src(path.src.img)
  	//.pipe(newer(path.build.img))
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(path.build.img))
    //.pipe(reload({stream: true}));
});

// bower
gulp.task('bower', function() {
    var jsFilter = filter('*.js');
    var cssFilter = filter('*.css');
    var fontFilter = filter(['*.eot', '*.woff', '*.svg', '*.ttf']);
    return gulp.src(mainBowerFiles())
	    // grab vendor js files from bower_components
	    .pipe(jsFilter)
	    //.pipe(newer(path.build.bower + '/js/'))
	    .pipe(uglify())
	    .pipe(rename({
	        suffix: ".min"
	    }))
	    .pipe(gulp.dest(path.build.bower + '/js/'))
	    .pipe(jsFilter.restore())
	    // grab vendor css files from bower_components
	    .pipe(cssFilter)
	    //.pipe(newer(path.build.bower + '/css'))
		.pipe(cleanCSS({compatibility: 'ie8'}))
	    .pipe(rename({
	        suffix: ".min"
	    }))
	    .pipe(gulp.dest(path.build.bower + '/css'))
	    .pipe(cssFilter.restore())
	    // grab vendor font files from bower_components
	    .pipe(fontFilter)
	    //.pipe(newer(path.build.bower + '/fonts'))
	    .pipe(flatten())
	    .pipe(gulp.dest(path.build.bower + '/fonts'));
});

// sass
gulp.task('sass', function () {
    gulp.src(path.src.style)
    	//.pipe(newer(path.build.css))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        //.pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

// fonts
gulp.task('fonts', function() {
    gulp.src(path.src.fonts)
    	.pipe(newer(path.build.fonts))
        .pipe(gulp.dest(path.build.fonts))
});

// pure js
gulp.task('js', function () {
    gulp.src(path.src.js)
    	//.pipe(newer(path.build.js))
        .pipe(rigger())
        .pipe(sourcemaps.init())
        //.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

// web server
gulp.task('webserver', function () {
    browserSync( serverConfig );
});


/* Run Tasks */

// BUILD
gulp.task('build', ['clean'], function () {
    gulp.start(['sass', 'jade', 'js', 'bower', 'images', 'fonts']);
});

// WATCH
gulp.task('watch', function(){
    watch([path.watch.style], function() { gulp.start('sass'); });
    watch([path.watch.jade], function() { gulp.start('jade'); });
    watch([path.watch.js], function() { gulp.start('js'); });
    watch([path.watch.img], function() { gulp.start('images'); });
});

// MAIN
gulp.task('default', ['build', 'webserver', 'watch']);
