// 载入外挂 
var gulp = require('gulp'), 
	//为CSS样式添加浏览器前缀  
	autoprefixer = require('gulp-autoprefixer'), 
	minifycss = require('gulp-minify-css'), 
	jshint = require('gulp-jshint'), 
	uglify = require('gulp-uglify'), 
	imagemin = require('gulp-imagemin'), 
	rename = require('gulp-rename'), 
	rimraf = require('gulp-rimraf'), 
	concat = require('gulp-concat'), 
	notify = require('gulp-notify'), 
	cache = require('gulp-cache'), 
	livereload = require('gulp-livereload'); 
 // 样式 
 gulp.task('styles', function() { 
 	return gulp.src('src/styles/**/*.css') 
 		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')) 
 		.pipe(gulp.dest('public/dist/styles')) 
 		.pipe(rename({ suffix: '.min' })) 
 		.pipe(minifycss()) 
 		.pipe(gulp.dest('public/dist/styles'))
 		//通知完成该任务
 		.pipe(notify({ message: 'Styles task complete' }));    
 });  
 // 脚本 
 gulp.task('scripts', function() { 
 	return gulp.src('src/scripts/**/*.js') 
 		.pipe(jshint())
 		//输出检查结果 
 		.pipe(jshint.reporter('default'))   
 		//合并成main.js
 		.pipe(concat('main.js'))     
 		.pipe(gulp.dest('public/dist/scripts')) 
 		.pipe(rename({ suffix: '.min' })) 
 		.pipe(uglify()) 
 		.pipe(gulp.dest('public/dist/scripts')) 
 		.pipe(notify({ message: 'Scripts task complete' })); 
 });  
 // 图片 
 gulp.task('images', function() { 
 	return gulp.src('src/images/**/*') 
 		.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))) 
 		.pipe(gulp.dest('public/dist/images')) 
 		.pipe(notify({ message: 'Images task complete' })); 
 });  
 // 清理 
 gulp.task('clean', function() { 
 	return gulp.src('public/dist', {read: false}) 
 	.pipe(rimraf()); 
 });  
 // 预设任务 
 gulp.task('default', ['clean'], function() { 
 	gulp.start('styles', 'scripts', 'images','watch'); 
 });  
 // 看守 
 gulp.task('watch', function() {  
 	// 看守所有.scss档,如果有改变,执行styles任务  
 	gulp.watch('src/styles/**/*.css', ['styles']);  
 	// 看守所有.js档,如果有改变,执行scripts任务  
 	gulp.watch('src/scripts/**/*.js', ['scripts']);  
 	// 看守所有图片档,如果有改变,执行images任务  
 	gulp.watch('src/images/**/*', ['images']);  
 	// 建立即时重整伺服器  
 	var server = livereload();  
 	// 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整  
 	gulp.watch(['public/dist/**']).on('change', function(file) { 
 		server.changed(file.path); 
 	}); 
 });