var gulp = require('gulp')
var concat = require('gulp-concat')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var less = require('gulp-less')
var cleanCSS = require('gulp-clean-css')
var htmlMin = require('gulp-htmlmin')
var livereload = require('gulp-livereload')
var connect = require('gulp-connect')
var open = require('open')


// 注册任务 在终端操作 ： gulp + 任务名
// gulp.task('任务名',gulp.series（function(){
    // 配置任务的操作
// }))

// 注册合并压缩 js 的任务
gulp.task('js', function () {
    return gulp.src('src/js/*.js') // 找到目标源文件，将数据读取到 gulp 的内存中
               .pipe(concat('build.js')) // 临时合并文件
               .pipe(gulp.dest('dist/js/')) // 临时输出文件到本地
               .pipe(uglify()) // 压缩文件
               // .pipe(rename('build.min.js')) //重命名的普通写法
               .pipe(rename({ suffix:'.min'})) //重命名运用 suffix来实现
               .pipe(gulp.dest('dist/js/')) // 任务输出的路径
               .pipe(livereload()) //实时刷新
               .pipe(connect.reload())
})

// 注册转换 less 的任务
gulp.task('less', function () {
    return gulp.src('src/less/*.less')
               .pipe(less()) //编译 less 文件为 css 文件
               .pipe(gulp.dest('src/css/')) // 临时输出文件到 src/css 文件夹中，和 css 文件一并打包
               .pipe(livereload()) 
               .pipe(connect.reload())

})

// 注册合并压缩 css 的任务
gulp.task('css',['less'],function () {
    return gulp.src('src/css/*.css')
               .pipe(concat('build.css'))
               .pipe(rename({suffix:'.min'}))
               .pipe(cleanCSS({compatibility:'ie8'}))
               .pipe(gulp.dest('dist/css/'))
               .pipe(livereload())
                .pipe(connect.reload())

})

// 注册压缩 html 文件的任务
gulp.task('html',function () {
    return gulp.src('index.html')
               .pipe(htmlMin({ collapseWhitespace:true})) //压缩 html，collapseWhitespace：清除空白（格）
               .pipe(gulp.dest('dist/'))
               .pipe(livereload())
                .pipe(connect.reload())
})

// 注册监视任务(半自动)
gulp.task('watch',['default'], function () {
    // 开启监听
    livereload.listen()
    // 确认监听的目标以及绑定相应的任务 gulp.watch(xx 类型的文件及路径，相关任务名)
    gulp.watch('src/js/*.js',['js'])
    gulp.watch(['src/css/*.css', 'src/less/*.less'],['css'])
})

// 注册监视任务（热加载 全自动）
gulp.task('server',['default'],function () {
    // 配置服务器的选项
    connect.server(
        {
            root:'dist/', // 文件输出的路径
            livereload:true, // 实时刷新
            port:5000  // 端口号
        }
    )
    // open 可以自动打开指定的连接
    open('http://localhost:5000/')
    // 确认监听的目标以及绑定相应的任务 gulp.watch(xx 类型的文件及路径，相关任务名)
    gulp.watch('src/js/*.js',['js'])
    gulp.watch(['src/css/*.css','src/less/*.less'],['css'])
})

// 注册默认任务  在终端直接操作：gulp
gulp.task('default',['js', 'less', 'css','html'])
// gulp.task('default', gulp.series(function () {
    
// }))

