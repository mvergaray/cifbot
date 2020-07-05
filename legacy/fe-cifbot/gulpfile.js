var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    less = require('gulp-less'),
    nodemon = require('gulp-nodemon'),
    $ = require('gulp-load-plugins')({lazy: true})
    path = require('path'),
    paths = {
      scripts: [
        'public/core/*.js',
        'public/features/*.js',
        'public/features/**/*.js',
        'server/*.js',
        'server/**/*.js'
      ],
      styles: [

        './public/*.less'
      ],
      scss: [
        './node_modules/angular-material/angular-material.scss',
      ],

      tmp: './public/.tmp'
    };


gulp.task('lint', function () {
  return gulp.src(paths.scripts)
      .pipe(eslint())
      .pipe(eslint.formatEach());
});

gulp.task('less', function () {
  return gulp.src(paths.styles)
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./public/'));
});

gulp.task('styles', function () {
  return gulp
      .src(paths.scss)
      .pipe($.sass())
      .pipe($.autoprefixer({
          browsers: ['last 2 versions', '> 5%']
      }))
      .pipe(gulp.dest(paths.tmp));
});

gulp.task('nodemon', function () {
  nodemon({
    script: 'server.js',
    ext: 'js html',
    ignore: 'public/*',
    env: { 'NODE_ENV': 'development' }
  })
});

// The default task (called when you run `gulp` from cli)
gulp.task('server', ['less', 'lint', 'nodemon']);