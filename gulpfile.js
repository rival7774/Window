const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const csso = require('postcss-csso');
const autoprefixer = require("autoprefixer");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const webp = require('gulp-webp');
const svgstore = require("gulp-svgstore");
const del = require('del');
const sync = require("browser-sync").create();

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};

exports.styles = styles;

//HTML

const html = () => {
  return gulp.src("source/**/*.html") //   **/-Все подпапки в папке sourse
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("build"));
};

exports.html = html;

// Scripts

const scripts = () => {
  return gulp.src("source/js/script.js")
    .pipe(terser())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
};

exports.scripts = scripts;

// Images

const optimizeImages = () => {
  return gulp.src("source/img/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
};

exports.optimizeImages = optimizeImages;

const optimizeImagesWebp = () => {
  return gulp.src("source/img/webp/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
};

exports.optimizeImagesWebp = optimizeImagesWebp;

const optimizeImagesFavicon = () => {
  return gulp.src("source/img/favicon/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img/favicon"));
};

exports.optimizeImagesFavicon = optimizeImagesFavicon;

const copyImages = () => {
  return gulp.src("source/img/*.{png,jpg,svg}")
    .pipe(gulp.dest("build/img"));
};

exports.copyImages = copyImages;

const copyImagesWebp = () => {
  return gulp.src("source/img/webp/*.{png,jpg,svg}")
    .pipe(gulp.dest("build/img"));
};

exports.copyImagesWebp = copyImagesWebp;

const copyImagesFavicon = () => {
  return gulp.src("source/img/favicon/*.{png,jpg,svg}")
    .pipe(gulp.dest("build/img/favicon"));
};

exports.copyImagesFavicon = copyImagesFavicon;

// webP

const createWebp = () => {
  return gulp.src("source/img/webp/*.{png,jpg}")
    .pipe(webp({
      quality: 80
    }))
    .pipe(gulp.dest("build/img"));
};

exports.createWebp = createWebp;

// Sprite

const sprite = () => {
  return gulp.src("source/img/icons/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
};

exports.sprite = sprite;

// Copy

const copy = (done) => {
  gulp.src([
      "source/fonts/*.{woff2,woff}",
      "source/*.ico",
      "source/*.webmanifest",
      "source/*.min.css",
      "source/plagins/*"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
  done();
};

exports.copy = copy;

// Clean

const clean = () => {
  return del("build");
};

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Relood

const reload = (done) => {
  sync.reload();
  done();
};

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/js/script.js", gulp.series("scripts"));
  gulp.watch("source/*.html", gulp.series(html, reload));
};

exports.default = gulp.series(styles, server, watcher);

// Build

const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  optimizeImagesWebp,
  optimizeImagesFavicon,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp
  )
);

exports.build = build;

//Default

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  copyImagesWebp,
  copyImagesFavicon,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);
