'use strict';

var ExecBuffer = require('exec-buffer');
var imageType = require('image-type');
var mozjpeg = require('mozjpeg').path;

/**
 * mozjpeg image-min plugin
 *
 * @param {Object} opts
 * @api public
 */

var eligibleKeyValCommands = [ 
	/* 
		For more information on these options or to add more options to this script, see: 
			https://github.com/mozilla/mozjpeg/blob/master/usage.txt
	*/
		'quality'
		/*
			Scale quantization tables to adjust image quality.
			Quality is 0 (worst) to 100 (best); default is 75.
			(See below for more info.)
	 	*/
]
module.exports = function (opts) {
	opts = opts || {};

	return function (file, imagemin, cb) {
		if (imageType(file.contents) !== 'jpg') {
			cb();
			return;
		}

		var exec = new ExecBuffer();
		var args = ['-copy', 'none'];

		for(var i=0; i < eligibleKeyValCommands.length; ++i) { 
			if(opts[eligibleKeyValCommands[i]]) 
				args.push('-'+eligibleKeyValCommands[i]+' ' + opts[eligibleKeyValCommands[i]])
		}
		
		if (opts.fastcrush) {
			args.push('-fastcrush');
		}

		exec
			.use(mozjpeg, args.concat(['-outfile', exec.dest(), exec.src()]))
			.run(file.contents, function (err, buf) {
				if (err) {
					cb(err);
					return;
				}

				file.contents = buf;
				cb();
			});
	};
};
