var gulp = require('gulp');
var shell = require('gulp-shell');
var browserSync = require('browser-sync').create();
var mainBowerFiles = require('main-bower-files');
var eyes = require('eyes');
var yaml = require('gulp-yaml');
var eslint = require('gulp-eslint');
var gulpIf = require('gulp-if');
var assets = require('./_data/scripts.json');
const reload = browserSync.reload;

var data = require('gulp-data');


gulp.task('lint', function () {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(assets.js)
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failOnError());
});

gulp.task('scripts', function() {
    // content
    eyes.inspect('running scripts...');
    eyes.inspect(assets.lib.js);
    gulp.src(assets.lib.js)
        .pipe(gulp.dest('scripts/vendor/'));
});

//get giabellasicon font

gulp.task('styles', function () {
    // content
    eyes.inspect('running styles...');
    gulp.src(assets.lib.css)
        .pipe(gulp.dest('css/vendor/'));
});

gulp.task('json-test', function() {
    return gulp.src('_data/scripts.json')
        .pipe(data())
        .pipe(gulp.dest('scripts/vendor/'));
});

gulp.task('yaml', function () {
    gulp.src('_data/assets.yml')

        // content
        .pipe(yaml())

        .pipe(gulp.dest('yaml-to-json/'));


});


// Task for building blog when something changed:
gulp.task('build', ['lint', 'scripts', 'styles'], shell.task(['bundle exec jekyll build --watch']));
// Or if you don't use bundle:
// gulp.task('build', shell.task(['jekyll build --watch']));

// Task for serving blog with Browsersync
gulp.task('serve', function () {
    browserSync.init({
        server: {baseDir: '_site/'},
        port:4000
    });
    // Reloads page when some of the already built files changed:
    gulp.watch('_site/**/*.*').on('change', browserSync.reload);
});

gulp.task('default', ['build', 'serve']);