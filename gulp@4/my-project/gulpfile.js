// 执行方法：gulp + 任务名
// 导入
const gulp = require('gulp')
const csssmin = require('gulp-cssmin')
const autoprefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const webserver = require('gulp-webserver');
const { watch } = require('vue');

// 创建一个打包 css 的任务 cssHandler
// gulp@3.9 语法
// gulp.task('cssHandler', function () {
//     return gulp
//         .src('./src/css/*.css') // 找到源文件（输入）
//         .pipe(csssmin()) // 压缩任务
//         .pipe(gulp.dest('./dist/css/')) // 输出路径,把处理好的内容传入到指定目录
// })

// 创建一个打包 css 的任务 cssHandler
// gulp@4 语法 需要在 gulpfile.js 中导出 module.exports.cssHandler = cssHandler
 const cssHandler = function () {
    return gulp
        .src('./src/css/*.css') // 找到源文件（输入）
        .pipe(autoprefixer()) // 自动添加前缀（兼容浏览器）
        .pipe(csssmin())  // 压缩任务 
        .pipe(gulp.dest('./dist/css/')) // 输出路径
 }

 // 创建一个打包 sass 的任务 sassHandler
const sassHandler = function () {
    return gulp
        .src('./src/sass/*.scss') // 找到源文件（输入）
        .pipe(sass()) // 转码 scss 转换为 css
        .pipe(autoprefixer()) // 自动添加前缀（兼容浏览器）
        .pipe(csssmin()) // 压缩任务 
        .pipe(gulp.dest('./dist/sass/')) // 输出路径
}

// 创建一个打包 js 的任务 jsHandler
const jsHandler = function () {
    return gulp
        .src('./src/js/*.js') // 找到源文件（输入）
        .pipe(babel({
            // babel@7 版本(对应 gulp@3)：presets:['es2015']
            presets:['@babel/env']
        })) // 将 es6 转译为 es5 ，不然 uglify 方法会报错
        .pipe(uglify()) // 压缩
        .pipe(gulp.dest('./dist/js/')) // 输出路径
}

// 创建一个打包 html 的任务 htmlHandler
const htmlHandler = function () {
    return gulp
            .src('./src/pages/*.html')
            .pipe(htmlmin({ // 通过配置参数来压缩
                collapseWhitespace:true ,// 移除空格
                removeEmptyAttributes:true, // 移除空的属性（仅限于原生的属性）
                collapseBooleanAttributes:true, // 简化类似 checked 布尔值属性（checked = "checked" ==> checked)
                removeAttributeQuotes:true,// 移除双引号，一般一个属性对应一个值不需要加双引号，一个属性对应两个值才需要加双引号
                minifyCSS:true, // 压缩内嵌式 css代码（只能压缩，不能自动添加前缀）
                minifyJS:true, // 压缩内嵌式 js 代码（只能压缩，不能转码）
                removeStyleLinkTypeAttributes:true, //移出 style 和 link 标签中的 type 属性（html5 标准不再要求）
                removeScriptTypeAttributes:true // 移出 javascript 标签中的 type 属性
            }))
            .pipe(gulp.dest('./dist/pages/'))
}


// 创建一个打包 image 的任务 imgHandler
const imgHandler = function () {
    return gulp
            .src('./src/images/**') // ** 因为图片会存在多种格式，所以打包 images 目录下的所有图片资源
            .pipe(gulp.dest('./dist/images/'))
}

// 创建一个打包 video 的任务 videoHandler
const videoHandler = function () {
    return gulp
            .src('./src/videos/**')
            .pipe(gulp.dest('./dist/videos/'))
}

// 创建一个打包 audio 的任务 audioHandler
const audioHandler = function () {
    return gulp
            .src('./src/audios/**')
            .pipe(gulp.dest('./dist/audios/'))
}

// 创建一个打包第三方库的任务 libHandler
const libHandler = function () {
    return gulp
            .src('./src/lib/**/*')
            .pipe(gulp.dest('./dist/lib/'))
}

// 创建一个打包 font 的任务 fontHandler
const fontHandler = function () {
    return gulp
            .src('./src/fonts/**/*')
            .pipe(gulp.dest('./dist/fonts/'))
}

// 创建一个删除 dist 目录的任务 delHandler
const delHandler = function () {
    // del 直接执行就可以了，不需要流
    // 参数以数组的形式传递你要删除的文件夹
    return del(['./dist/'])
}

// 创建一个启动服务器的任务 webHandler
const webHandler = function () {
    return gulp
            .src('./dist')
            .pipe(webserver({
                host:'localhost', //域名（可以配置自定义域名）
                port:'8083', // 端口号
                livereload:true, //自动刷新页面
                open:'./pages/login.html' // 默认打开的文件路径，从 dist 目录之后开始书写
            }))
}

// 创建一个监视文件变化的任务
const watchHandler = function () {
    // 使用 gulp.watch(监视的文件路径，文件相关的任务名) 
    gulp.watch('./src/css/*.css',cssHandler)
    gulp.watch('./src/js/*.js',jsHandler)
    gulp.watch('./src/pages/*.html',htmlHandler)
    gulp.watch('./src/sass/*.scss',sassHandler)
}

//  导出任务
module.exports.cssHandler = cssHandler
module.exports.sassHandler = sassHandler
module.exports.jsHandler = jsHandler
module.exports.htmlHandler = htmlHandler
module.exports.imgHandler = imgHandler
module.exports.videoHandler = videoHandler
module.exports.audioHandler = audioHandler
module.exports.libHandler = libHandler
module.exports.fontHandler = fontHandler
module.exports.delHandler = delHandler
module.exports.webHandler = webHandler
module.exports.watchHandler = watchHandler

// 要么使用 gulp.series()(一个任务开始-->结束-->第二个任务开始-->结束...),要么使用 gulp.parallel()(所有任务同时开始，根据大小来决定完成顺序)
// 这两个方法返回值是一个函数，返回值可以直接当做任务函数使用
// 使用 task的方式创建一个 default 任务
// 方式一：
    // gulp.task('default',()=>{})
    // gulp.task('default',gulp.parallel(cssHandler,sassHandler,htmlHandler,jsHandler,imgHandler,fontHandler,videoHandler,audioHandler,libHandler))
// 方式二：
    // module.exports.default = () => {}

// 创建一个默认任务，即执行所有任务
// module.exports.default = gulp.parallel(cssHandler,sassHandler,jsHandler,htmlHandler,imgHandler,videoHandler,audioHandler,libHandler,fontHandler)

// 添加完删除 dist 目录的任务之后，修改 default 任务
// module.exports.default = gulp.series(
//     delHandler,
//     gulp.parallel(cssHandler,sassHandler,jsHandler,htmlHandler,imgHandler,videoHandler,audioHandler,libHandler,fontHandler)
// )

// 添加完服务器启动任务之后，修改 default 任务
module.exports.default = gulp.series(
    delHandler,
    gulp.parallel(cssHandler,sassHandler,jsHandler,htmlHandler,imgHandler,videoHandler,audioHandler,libHandler,fontHandler),
    webHandler,
    watchHandler
)
    