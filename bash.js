/****************************************
 * bash.js
 * 
 * Providing helpers for issuing bash
 * commands and error handling
 ****************************************/

var exec = require('child_process').exec;

exports.run = function(command, onStderr, onStdout) {
	var proc = exec(command, function(error, stdout, stderr) {
		if (error !== null)
			console.log("ERROR: " + error);
	});

	var out = new Array();
	var err = new Array();

	proc.stderr.setEncoding('utf8');
	proc.stdout.setEncoding('utf8');

	proc.stderr.on('data', function(chunk) {
		err.push(chunk);
	});

	proc.stdout.on('data', function(chunk) {
		out.push(chunk);
	});

	proc.stderr.on('end', function() {
		if (onStderr)
			onStderr(err.join());
	});

	proc.stdout.on('end', function() {
		if (onStdout)
			onStdout(out.join());
	});

	return proc;
}

exports.onStderr = function(stderr){
	if (stderr.length > 0){
		console.log('ERROR: ' + stderr);
		process.exit(1);
	}
}

exports.cd = function(dirName, errorMessage){
	try{
		process.chdir(dirName);
	} catch(ex){
		console.log('ERROR: ' + ex);
		if (errorMessage){
			console.log('ERROR: ' + errorMessage);
		}
	}
}