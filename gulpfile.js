const gulp = require('gulp');
const cssBase64 = require('gulp-css-base64');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const stylus = require('gulp-stylus');
const touch = require('gulp-touch-cmd'); 
const gutil = require('gulp-util');
const nib = require('nib');
const PKG = require('./package.json');
const OUTPUT_DIR = './build/client';

function logError(error)
{
	gutil.log(gutil.colors.red(error.stack));
}

gulp.task('css', () =>
{
	return gulp.src('client/src/stylus/index.styl')
		.pipe(plumber())
		.pipe(stylus(
			{
				use      : nib(),
				compress : process.env.NODE_ENV === 'production'
			}))
		.on('error', logError)
		.pipe(cssBase64(
			{
				baseDir           : '.',
				maxWeightResource : 50000 // So big ttf fonts are not included, nice.
			}))
		.pipe(rename(`${PKG.name}.css`))
		.pipe(gulp.dest(OUTPUT_DIR))
		.pipe(touch());
});
