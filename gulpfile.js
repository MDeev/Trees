var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var prefix = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var webserver = require('gulp-webserver');
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminZopfli = require('imagemin-zopfli');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminGiflossy = require('imagemin-giflossy');
var notify = require('gulp-notify');
var zip = require('gulp-zip');

var paths = {
  styles: { src: ['./src/scss/*.scss', './src/scss/**/*.scss'], dest: './dist/css/' },
  scripts: { src: './src/js/*.js', dest: './dist/js/' },
  html: { src: ['./src/*.html', './src/**/*.html'], dest: './dist/' },
  lib: { src: './src/libs/*', dest: './dist/js' },
  fonts: { src: './src/fonts/*', dest: './dist/fonts' },
  img: { src: './src/img/*', dest: './dist/img' },
  css_lib: { src: './src/css_lib/*', dest: './dist/css' },
  favicon: { src: './src/favicon.ico', dest: './dist/' }
};

function clean() { return del.sync(['./dist']); }

function BuildImages() {
  return gulp.src(paths.img.src)
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.gifsicle({ interlaced: true, optimizationLevel: 3 }),
      imagemin.svgo({ plugins: [{removeViewBox: false}] }),
      imagemin.jpegtran({ progressive: true }),
      imageminPngquant({ speed: 1, quality: [0.90, 0.98] }),
      imageminZopfli({ more: true }),
      imageminGiflossy({ optimizationLevel: 3, optimize: 3, lossy: 2 }),
      imageminMozjpeg({ quality: 90 })
    ]))
    .pipe(gulp.dest(paths.img.dest))
    .pipe(notify(notification('Images', 'All images are compressed!')));
}

gulp.task('img', function () {
  return BuildImages();
});

function BuildCssLibs() {
  return gulp.src(paths.css_lib.src)
  .pipe(gulp.dest(paths.css_lib.dest));
}

gulp.task('css_lib', function () {
  return BuildCssLibs();
});

function BuildFonts() {
  return gulp.src(paths.fonts.src)
  .pipe(gulp.dest(paths.fonts.dest));
}

gulp.task('fonts', function () {
  return BuildFonts();
});

function BuildLibs() {
  return gulp.src(paths.lib.src)
  .pipe(gulp.dest(paths.lib.dest));
}

gulp.task('libs', function () {
  return BuildLibs();
});

function BuildHTML() {
  return gulp.src(paths.html.src)
  .pipe(gulp.dest(paths.html.dest))
  .pipe(notify(notification('HTML', 'Html saved!')));
}

gulp.task('html', function () {
  return BuildHTML();
});

function Favicon() {
  return gulp.src(paths.favicon.src)
  .pipe(gulp.dest(paths.favicon.dest));
}

gulp.task('favicon', function () {
  return Favicon();
});

function BuildStyles() {
  return gulp.src(paths.styles.src[0])
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(prefix('last 10 versions'))
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(notify(notification('CSS', 'Styles saved!')));
}

gulp.task('styles', function() {
  return BuildStyles();
});

function BuildScripts(){
  return gulp.src(paths.scripts.src)
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(notify(notification('JavaScript', 'JS saved!')));
}

gulp.task('scripts', function() {
  return BuildScripts();
});

gulp.task('build', function() {
  return clean() && BuildHTML() && BuildStyles() && BuildScripts() && BuildLibs() && BuildImages() && BuildFonts() && BuildCssLibs() && Favicon();
});

gulp.task('watch', function () {
  gulp.watch(paths.html.src, gulp.series('html'));
  gulp.watch(paths.scripts.src, gulp.series('scripts'));
  gulp.watch(paths.styles.src, gulp.series('styles'));
  gulp.watch(paths.lib.src, gulp.series('libs'));
  gulp.watch(paths.fonts.src, gulp.series('fonts'));
  gulp.watch(paths.img.src, gulp.series('img'));
  console.log('Watch is running...');
});

gulp.task('server', function() {
    gulp.src(paths.html.dest)
    .pipe(webserver({ livereload: true, open: true, port: 8000 }))
    .pipe(notify(notification('Server', 'Server is started!')));
});

function notification(title, message){
  return { title: title, message: message, icon: paths.favicon.dest + '/favicon.ico' };
}

gulp.task('zip', function () {
  return gulp.src('./dist/**').pipe(zip('Template.zip')).pipe(gulp.dest('.'));
});

gulp.task('default', gulp.series('watch'));