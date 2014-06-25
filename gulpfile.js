var gulp = require('gulp');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var path = require('path');
var fs = require('fs');

var paths = {
	css: ['app/css/src/**/*.css'],
	js: ['app/js/src/**/*.js']
}

var Fetcher = {
	data: {},
	queue: [],
	init: function() {
		this.queue = [];
		this.data = [];
		return this;
	},
	getFile:function(match, file) {
		this.queue.push({match: match, file: path.normalize(file)});
		return this;
	},
	fetch: function(cb) {
		if(this.queue.length == 0) {
			cb(this.data);
		} else {
			var entry = this.queue.shift();
			fs.readFile(entry.file, { encoding: 'utf8'}, function(err, data) {
				this.data[entry.match] = data;
				this.fetch(cb);
			}.bind(this));
		}
	}
}

gulp.task('concat-css', function() {  
  	return gulp.src(paths.css)
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('app/css'));
});

gulp.task('concat-js', function() {  
  	return gulp.src(paths.js)
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('app/js'));
});

gulp.task('concat', ['concat-css', 'concat-js'], function() {
	Fetcher
	.init()
	.getFile('{css}', __dirname + '/app/css/styles.css')
	.getFile('{js}', __dirname + '/app/js/scripts.js')
	.fetch(function(data) {
		gulp.src(['app/drawing.html'])
		.pipe(replace('{css}', data['{css}']))
		.pipe(replace('{js}', data['{js}']))
		.pipe(gulp.dest('./'));
	});
});

gulp.task('watch', function() {
	gulp.watch(paths.css.concat(paths.js).concat(['app/**/*.html']), ['concat']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['concat', 'watch']);