const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const composer = require('gulp-uglify/composer');
const uglifyES = require('uglify-es');
const postcss = require('gulp-postcss');
const gulpIf = require('gulp-if');
const htmlMin = require('gulp-htmlmin');
const cssnano = require('cssnano');
const imageMin = require('gulp-imagemin');
const cache = require('gulp-cache');
const del = require('del');
const runSequence = require('run-sequence');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const filter = require('gulp-filter');

const minify = composer(uglifyES);

// Intro Hello Task...
gulp.task('hello', function() {
  console.log('Hello, Class!');
});

// Sass Task
gulp.task('sass', function(){
	return gulp.src('dev/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dev/styles'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// Autoprefixer Task
gulp.task('autoprefixer', function() {
    return gulp.src('dev/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(postcss([autoprefixer({browsers: ['ie 8-11','last 2 versions']})]))
        .pipe(sourcemaps.write('/'))
		.pipe(gulp.dest('dev/styles'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// Watch Task
gulp.task('watch', function(){
	gulp.watch('dev/scss/**/*.scss', ['sass']);
	gulp.watch('dev/*.html', browserSync.reload);
	gulp.watch('dev/scripts/**/*.js', browserSync.reload);
});

// Watch Task with Autoprefixer
gulp.task('watch-autoprefixer', function(){
	gulp.watch('dev/scss/**/*.scss', ['autoprefixer']);
	gulp.watch('dev/*.html', browserSync.reload);
	gulp.watch('dev/scripts/**/*.js', browserSync.reload);
});

// BrowserSync Task
gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir: 'dev'
		}
	});
});

// Compress Task
gulp.task('compress', function(){
   
    const f = filter(['**/*.css', '**/*.js'], {restore: true});

	return gulp.src('dev/*.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', minify()))
		.pipe(gulpIf('*.css', postcss([cssnano()])))
		.pipe(gulpIf('*.html', htmlMin({collapseWhitespace: true})))
		.pipe(f)
		.pipe(rev())
		.pipe(f.restore)
		.pipe(revReplace())
		.pipe(gulp.dest('dist'));

});

// Image Optimization Task
gulp.task('images', function(){
	return gulp.src('dev/images/**/*.+(png|jpg|gif|svg)')
		.pipe(cache(imageMin({
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'));
});

// Fonts Task
gulp.task('fonts', function(){
	return gulp.src('dev/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));
});

// Clean Dist Folder Task
gulp.task('clean:dist', function(){
	return del.sync('dist');
});

// Default Task
gulp.task('default', function() {
  runSequence(['sass', 'browserSync'], 'watch');
});

// Default Task with Autoprefixer
gulp.task('default:autoprefixer', function() {
	runSequence(['autoprefixer', 'browserSync'], 'watch-autoprefixer');
});

// Build Task
gulp.task('build', function(){
	runSequence('clean:dist', 'autoprefixer', ['compress', 'images', 'fonts']);
});











