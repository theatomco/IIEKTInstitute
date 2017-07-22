var gulp = require('gulp'),
	bs = require('browser-sync').create(),
	htmlmin = require('gulp-htmlmin'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	sass = require('gulp-sass'),
	imagemin = require('gulp-imagemin'),
	zip = require('gulp-zip');
	sourcemaps = require('gulp-sourcemaps'),
	historyApiFallback = require('connect-history-api-fallback');

/*
 * @param {string} name
 * @param {Array|string} dependencies
 */
function addWatcher(name, dependencies) {
	return gulp.task(name + '-watch', dependencies, function(done) { bs.reload(); done(); });
}

gulp.task('html', function() {
	gulp.src('./source/**/*.html')
		.pipe(htmlmin({
			collapseWhitespace: false,
			removeComments: false
		}))
		.pipe(gulp.dest('./public'));
});

gulp.task('html-prod', function() {
	gulp.src('./source/**/*.html')
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest('./build'));
});

gulp.task('js', function() {
	gulp.src('./source/js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(concat('app.bundle.js'))
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./public/js'));
});

gulp.task('js-prod', function() {
	gulp.src('./source/js/**/*.js')
		.pipe(concat('app.bundle.js'))
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(uglify())
		.pipe(gulp.dest('./build/js'));
});

gulp.task('sass', function() {
	gulp.src('./source/styles/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded' // nested, expanded, compact, compressed
		}).on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./public/styles'));
});

gulp.task('sass-prod', function() {
	gulp.src('./source/styles/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed' // nested, expanded, compact, compressed
		}).on('error', sass.logError))
		.pipe(gulp.dest('./build/styles'));
});

gulp.task('assetsmin', function() {
	gulp.src('./source/assets/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./public/assets'));
});

gulp.task('assetsmin-prod', function() {
	gulp.src('./source/assets/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./build/assets'));
});

gulp.task('vendormove', function() {
	gulp.src('./source/vendor/**/*')
		.pipe(gulp.dest('./public/vendor'));
});

gulp.task('vendormove-prod', function() {
	gulp.src('./source/vendor/**/*')
		.pipe(gulp.dest('./build/vendor'));
});

gulp.task('json', function() {
	gulp.src('./source/**/*.json')
		.pipe(gulp.dest('./public'));
});

gulp.task('json-prod', function() {
	gulp.src('./source/**/*.json')
		.pipe(gulp.dest('./build'));
});

addWatcher('html', ['html']);
addWatcher('js', ['js']);
addWatcher('sass', ['sass']);
addWatcher('json', ['json']);

gulp.task('serve', ['html', 'js', 'sass', 'assetsmin', 'vendormove', 'json'], function() {
	bs.init({
		server: {
			baseDir: './public',
			middleware: [historyApiFallback()]
		},
		notify: false
	});

	gulp.watch('./source/**/*.html', ['html-watch']);
	gulp.watch('./source/js/**/*.js', ['js-watch']);
	gulp.watch('./source/styles/**/*.scss', ['sass-watch']);
	gulp.watch('./source/**/*.json', ['json-watch']);
});

gulp.task('default', ['serve']);

gulp.task('build-dev');
gulp.task('build-prod', ['html-prod', 'js-prod', 'sass-prod', 'vendormove-prod', 'json-prod']);

gulp.task('pack', function() {
	gulp.src('./build/**/*')
		.pipe(zip('app.pack.zip'))
		.pipe(gulp.dest('./'));
});
