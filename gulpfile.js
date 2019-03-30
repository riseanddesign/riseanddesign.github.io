const gulp = require('gulp') // load gulp
const sass = require('gulp-sass') // load gulp-sass
const browserSync = require('browser-sync').create() // load browser-sync and create an instance
const postcss = require('gulp-postcss') // load the postcss library
const autoprefixer = require('autoprefixer') // load the autoprefixer plugin
const cssnano = require('cssnano') // load the cssnano plugin
const concat = require('gulp-concat') // load the gulp-concat for concatenating js files
const rename = require('gulp-rename') // load gulp-rename to rename our js file
const uglify = require('gulp-uglify') // load uglify for minifying our js file

// Define a task to compile Sass and run autoprefixer and cssnano
gulp.task('sass', function () {
  const plugins = [
    autoprefixer({ browsers: ['last 2 version'] }),
    cssnano()
  ]
  return gulp
    .src('scss/**/*.scss') // source of any sass files
    .pipe(sass()) // run the sass compiler on the source file
    .pipe(gulp.dest('css')) // destination for the compiled css files
    .pipe(postcss(plugins)) // apply the PostCSS plugins
    .pipe(gulp.dest('css/min')) // path to output the minified css file
    .pipe(browserSync.stream()) // run the browsersync stream
})

gulp.task('scripts', function () {
  return gulp.src('js/*.js') // setting the source files for gulp to work with
    .pipe(concat('main.js')) // running concat on all the files directly inside js folder with extension .js. The new file will be names main.js
    .pipe(gulp.dest('js/dev')) // save the concatenated file into dev folder
    .pipe(rename('main.min.js')) // pipe the contatenated file and rename it to main.min.js
    .pipe(uglify()) // now running uglify on the renamed file to minify the JavaScript
    .pipe(gulp.dest('js/min')) // saving the minified file in min folder inside js
    .pipe(browserSync.stream()) // run the browsersync stream
})
// Define the default task
gulp.task('default', function () {
  // initialize browserSync on the current folder
  browserSync.init({ server: './' })
  // watch for changes to any files in scss folder and its sub folders and with .scss extension, run the sass task when a change is found
  gulp.watch('scss/**/*.scss', gulp.series('sass'))
  // watch for changes to any files directly inside the js folder and on change run the task scripts
  gulp.watch('js/*.js', gulp.series('scripts'))
  // watch for changes on any .html file and reload the browser on change
  gulp.watch('*.html').on('change', browserSync.reload)
})
