var gulp = require('gulp');
var gulpPlumber = require('gulp-plumber');
var gulpReplace = require('gulp-replace');
var gulpUglify = require('gulp-uglify');
var gulpImage = require('gulp-image');
var gulpConnect = require('gulp-connect');
var gulpSass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var webpackStream = require('webpack-stream');
var livereload = require('gulp-livereload');
var jade = require("gulp-jade");
var inlinesource = require('gulp-inline-source');
// var postcss = require('gulp-postcss');
//var px2rem = require('postcss-px2rem');
//var responsive = require('gulp-responsive');

//全局配置相关
var config = {
    //宏定义
    macro: {
        '__VERSION': Date.now().toString(16)
    },
    //编译目录
    build: './build/',
    //发布目录
    release: '../dist',
    //webpack构建配置
    webpack: {
        index: './js/index.js'
    }
};

gulp.task('sass', function () {
    return gulp.src('./sass/*.scss')
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions', 'ie >= 8', 'Chrome >= 34', 'Firefox >= 30', 'safari >= 6', 'android >= 4.4', 'ios >= 7'],
            cascade: false
        }))
        .pipe(gulp.dest('./css/'));
});

gulp.task('css', ['sass'], function () {
    return gulp.src(['./css/*.css'])
        .pipe(gulpPlumber())
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.build + '/css/'));
});

gulp.task('webpack', function () {
    return gulp.src('./js/*.js')
        .pipe(webpackStream({
            entry: config.webpack,
            output: {
                filename: '[name].bundle.js'
            }
        }))
        .pipe(gulp.dest('./js/'));
});

gulp.task('js', ['webpack'], function () {
    return gulp.src(['./js/*.bundle.js'])
        .pipe(gulpPlumber())
        .pipe(gulpUglify())
        .pipe(gulp.dest(config.build + 'js/'));
});

gulp.task('image', function () {
    return gulp.src('./img/**/*.+(jpg|png|gif|svg)')
        .pipe(gulpImage({
            zopflipng: false,
            jpegoptim: true
        }))
        .pipe(gulp.dest(config.build + 'img/'));
});

gulp.task('font', function () {
    return gulp.src('./font/*.+(eot|svg|ttf|woff)')
        .pipe(gulp.dest(config.build + 'font/'));
});

gulp.task('favicon', function () {
    return gulp.src('./*.ico')
        .pipe(gulp.dest(config.build));
});

gulp.task('jade', function () {
    return gulp.src(['jade/*.jade', '!jade/layout.jade'])
        .pipe(jade({pretty: true}))
        .pipe(inlinesource())
        .pipe(gulp.dest('./'))
});

gulp.task('html', ['jade'], function () {
    return gulp.src('./*.html')
        .pipe(gulp.dest(config.build));
});

gulp.task('macro', ['css', 'js', 'image', 'font', 'html'], function () {
    var stream = gulp.src([config.build + '**/*.css', config.build + '**/*.js', config.build + '*.html']);
    for (var key in config.macro) {
        if (config.macro.hasOwnProperty(key)) {
            stream = stream.pipe(gulpReplace(key, config.macro[key]));
        }
    }
    return stream.pipe(gulp.dest(config.build));
});

gulp.task('default', ['macro'], function () {
    return gulp.src(config.build + '**')
       .pipe(gulp.dest(config.release));
});

gulp.task('watch', function () {
    //livereload.listen();
    gulp.watch(['./sass/**/*.scss','./sass/**/*.sass'], ['css']);
    gulp.watch(['./js/**/*.js','!./js/*.bundle.js'], ['js']);
    gulp.watch('jade/**/*.jade', ['html']);
    // gulp.watch('./*.html', ['html']);
});

//启动一个本地调试服务器
gulp.task('server', function () {
    gulpConnect.server({
        root: '',
        port: 8000
    });
});