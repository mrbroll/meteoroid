/****************************************
 * scaffold.js
 * This file contains all functionality
 * necessary to create and scaffold a new
 * application.
 ****************************************/
var fs = require('fs');
var bash = require('./bash');
var Meteoroid = require('./meteoroid');
var RollBack = require('./rollback');

/****************************************
 * Setting up some event listeners to
 * know when to go to the next step for
 * all of our bash commands and other
 * asynchronous operations
 ****************************************/
var registerGeneratorEvents = function(config) {
	var projectDir = [process.cwd(), config.name].join('/');

	process.on('kickOff', function() {
		checkMeteor();
	});

	process.on('checkMeteorDone', function() {
		checkMeteorite();
	});

	process.on('checkMeteoriteDone', function() {
		createProject(config.name);
	});

	process.on('createProjectDone', function() {
		installPackages(projectDir, config.packages);
	});

	process.on('installPackagesDone', function() {
		scaffoldDirs(projectDir, config.dirs);
	});

	process.on('scaffoldDirsDone', function() {
		console.log('project created successfully');
		process.exit(0);
	});
}

/****************************************
 * Event Helpers
 ****************************************/
var checkMeteor = function() {
	bash.run("meteor --help", function(stderr) {
		if (stderr.length > 0) {
			// try to install Meteor
			bash.run("curl https://install.meteor.com/ | /bin/sh", function(stderr) {
				if (stderr.length > 0) {
					console.log("ERROR: unable to install Meteor, Please ensure you have the curl utility installed and in your path");
					process.exit(1);
				} else
					process.emit('checkMeteorDone');
			});
		} else
			process.emit('checkMeteorDone');
	});
}

var checkMeteorite = function() {
	bash.run("mrt --help", function(stderr) {
		if (stderr.length > 0) {
			// try to install meteorite
			bash.run("npm install -g meteorite", function(stderr) {
				if (stderr.length > 0) {
					console.log("ERROR: unable to install Meteorite, Please ensure you have npm installed and in your path\n*");
					console.log("If you wish to install meteorite manually, visit https://github.com/oortcloud/meteorite for instructions");
					process.exit(1);
				} else
					process.emit('checkMeteoriteDone');
			});
		} else
			process.emit('checkMeteoriteDone');
	});
}

var createProject = function(name) {
	bash.run('mrt create ' + name, function(stderr) {
		if (stderr.length > 0) {
			if (stderr.indexOf(name + ': created') === -1) {
				console.log("ERROR: " + stderr);
				rollBack.panic();
			} else
				process.emit('createProjectDone');

		} else
			process.emit('createProjectDone');
	});
}

var installPackages = function(projectDir, packages) {
	bash.cd(projectDir);
	console.log('installing packages...');
	packages.forEach(function(value, index, arr) {
		console.log('installing ' + value + '...');
		bash.run('mrt add ' + value, function(stderr) {
			if (!stderr.startsWith(value)) {
				console.log('ERROR ' + stderr)
			} else
				console.log('installed ' + value);
		}, function(stdout) {
			if (stdout.length === 0) {
				console.log('ERROR: The package named ' + value + ' does not exist anywhere.');
				rollBack.panic();
			}
		});
	});
	process.emit('installPackagesDone');
}

// function to recursively write directories
var createDir = function(dir) {
	if (!dir.name) {
		console.log('ERROR: missing directory name under path ' + parentPath);
		rollBack.panic();
	}

	fs.mkdirSync(dir.name, function(err) {
		console.log('ERROR: ' + err);
		rollBack.panic();
	});

	bash.cd(dir.name);

	dir.childDirs.forEach(function(value, index, arr) {
		createDir(value);
	});

	bash.cd('..');
}

var scaffoldDirs = function(projectDir, dirs) {
	console.log('creating directories...');
	bash.cd(projectDir);
	dirs.forEach(function(value, index, arr) {
		createDir(value);
		console.log('created dir ' + value.name);
	});
	process.emit('scaffoldDirsDone');
}

/****************************************
 * Generator
 ****************************************/

exports.generate = function(args) {
	// get the config
	var meteoroid = new Meteoroid(args);

	// set up rollback
	rollBack = new RollBack(process.cwd(), meteoroid.name);

	registerGeneratorEvents(meteoroid);
	process.emit('kickOff');
}