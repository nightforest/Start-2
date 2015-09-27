var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var wiredep = require('wiredep').stream;
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var clean = require('gulp-clean');
var uncss = require('gulp-uncss');
var autoprefixer = require('gulp-autoprefixer');

// Добавление префиксов в CSS
gulp.task('autoprefixer', function () {
    return gulp.src('app/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 15 versions'],
            cascade: true
        }))
        .pipe(gulp.dest('app/css'));
});

// Удаление неиспользуемых стилей CSS
gulp.task('uncss', function () {
    return gulp.src('dist/css/*.css')
        .pipe(uncss({
            html: ['dist/index.html']
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/css/'));
});

// Очистка папки
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

// Сборка поекта
gulp.task('build', ['clean'], function () {
    var assets = useref.assets();

    gulp.src(['app/fonts/**/*.*', 'app/img/**/*.*', 'app/*.php'], {base: 'app'})
  		.pipe(gulp.dest('dist')) //копирует папку img и fonts в dist

    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

// Компиляция Jade файлов
gulp.task('jade', function() {
  gulp.src('app/jade/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('app/'))
});

// Автоподключение CSS и JS файлов в index.html
gulp.task('bower', function () {
  gulp.src('./app/index.html')
    .pipe(wiredep({
      directory : 'app/bower_components',
      exclude: ['es5-shim', 'html5shiv', 'respond']
    }))
    .pipe(gulp.dest('./app'));
});

// Компиляция SASS файлов
gulp.task('sass', function () {
  gulp.src('app/sass/**/*.sass')
    .pipe(sass({
    includePaths: require('node-bourbon').includePaths
    }).on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 15 versions'],
        cascade: true
    }))
    .pipe(gulp.dest('app/css'));
});

// Выбор главных файлов JS
gulp.task('mainJS', function() {
  return gulp.src(mainBowerFiles('**/*.js'))
    .pipe(gulp.dest('app/js'));
});

// Выбор главных файлов CSS
gulp.task('mainCSS', function() {
  return gulp.src(mainBowerFiles('**/*.css'))
    .pipe(gulp.dest('app/css'));
});

// Конкатенация файлов JS
gulp.task('concatJS', function() {
  return gulp.src('dist/js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/'));
});

// Конкатенация файлов CSS
gulp.task('concatCSS', function() {
  return gulp.src('dist/css/*.css')
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function() {
  gulp.watch(['bower.json', 'app/index.html'], ['bower'])
  gulp.watch('app/sass/**/*.sass', ['sass'])
  gulp.watch('app/jade/**/*.jade', ['jade'])
});

gulp.task('default', function() {
  // place code for your default task here
});