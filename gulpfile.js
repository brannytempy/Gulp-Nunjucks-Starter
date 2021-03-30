var gulp = require('gulp');
let uglify = require('gulp-uglify-es').default;
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var es = require('event-stream');
var browserSync = require('browser-sync').create();
var nunjucksRender = require('gulp-nunjucks-render');
var gutil = require('gulp-util');
var responsive = require('gulp-responsive');
var $ = require('gulp-load-plugins')();

sass.compiler = require('node-sass');

gulp.task('scripts', function() {
	var bootstrapJavascript = gulp.src('src/js/bootstrap.min.js');
	var thirdPartyJavascript = gulp.src('src/js/3rd-party/**/*.js');
	var customJS = gulp.src('src/js/main.js');
	return es
		.merge(bootstrapJavascript, thirdPartyJavascript, customJS)
		.pipe(concat('main.min.js'))
		.pipe(uglify().on('error', gutil.log))
		.pipe(gulp.dest('app/assets/js'))
		.pipe(
			browserSync.reload({
				stream: true
			})
		);
});

gulp.task('copy-scripts', function() {
	gulp.src('./src/js/pace.js').pipe(gulp.dest('./app/assets/js/'));
});

gulp.task('copy-images', function() {
	gulp.src('./src/images/**/*').pipe(gulp.dest('./app/assets/images/'));
});

gulp.task('sass', function () {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
		.pipe(
			cleanCSS({
				compatibility: 'ie8'
			})
		)
    .pipe(gulp.dest('./app/assets/css'))
		.pipe(
			browserSync.reload({
				stream: true
			})
		);
});

gulp.task('nunjucks', function() {
	// Gets .html and .nunjucks files in pages
	return (
		gulp
			.src('src/_pages/**/*.+(html|nunjucks)')
			// Renders template with nunjucks
			.pipe(
				nunjucksRender({
					path: ['src/_templates']
				})
			)
			// output files in app folder
			.pipe(gulp.dest('app'))
	);
});

gulp.task('copy-gifs', function() {
	gulp.src('./src/images/**/*.gif').pipe(gulp.dest('./app/assets/images/'));
});

gulp.task('copy-svgs', function() {
	gulp.src('./src/svg/**/*.svg').pipe(gulp.dest('./app/assets/svg/'));
});

gulp.task('copy-webfonts', function() {
	gulp.src('./src/webfonts/**/*').pipe(gulp.dest('./app/assets/webfonts/'));
});

gulp.task('copy-videos', function() {
	gulp.src('./src/videos/**/*').pipe(gulp.dest('./app/assets/videos/'));
});

gulp.task('copy-css', function() {
	gulp.src('./src/css/**/*').pipe(gulp.dest('./app/assets/css/'));
});

gulp.task(
	'build',
	[
		'sass',
		'scripts',
		'nunjucks',

		'copy-scripts',
		'copy-images'
	],
	function() {
		console.log('Building files');
	}
);

// main watch task
gulp.task('watch', ['build'], function() {
	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch('app/**/*.html').on('change', browserSync.reload);
	gulp.watch('src/**/*.+(html|nunjucks)', ['nunjucks']);
	gulp.watch('src/js/**/*.js', ['scripts']);

	browserSync.init({
		server: {
			baseDir: 'app'
		}
	});
});
