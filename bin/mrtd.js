#!/usr/bin/env node

/****************************************
 * Use this script to scaffold out a new
 * meteor application, and install meteor,
 * and meteorite if not already
 *
 * Note: This script requires node and
 * npm to be installed and in your path
 ****************************************/

/***************************************
 * Usage: mrts <name> [-i [packages]] [-o [options]]
 * Alternate: mrts </path/to/config.json>
 *
 * Name: --Required--
 *		This is the name of the project
 *		you wish to create. This will be
 *		the name of the project root
 *		directory.
 *
 * Packages: --Optional--
 *		This is space-delimited list of
 *		meteorite packages you wish to
 *		install. If none are specified,
 *		the default packages will be
 *		installed. The default packages
 *		include: accounts-base,
 *		accounts-password, http,
 *		iron-router, and scss.
 *		-These Default packages could
 *		change in future releases
 *
 * Options: --Optional-- (Duh!)
 *		no-pkg: prevent default
 *		packages from being installed.
 *		Only the packages that meteor
 *		provides by default will be
 *		included.
 *
 *		-Might come up with additional
 *		options for future releases
 *
 * Config Format:
 * 		{
 *		 	packages: [
 *		 		{
 *					name: STRING,
 *					version: STRING
 *		 		}
 *		 	],
 *		 	options: [STRING],
 *			directories: [
 *				{
 *					name: STRING,
 *					readme: BOOL,
 *					childDirs: [DIRECTORY]
 *				}
 *			]
 *		}
 *
 ***************************************/

var fs = require('fs');
var sys = require('sys');
var bash = require('../lib/bash');

var args = process.argv.slice(2);

if (args.length < 1) {
	console.log("Dude, give your project a name at least.");
	process.exit(1);
}

if (!args.every(function(value, index) {
	return /^[\w-]+$/.test(value);
})) {
	console.log("You have to provide at least 4 characters using only alphanumerics, hyphens, and underscores");
	process.exit(1);
}

// get all the package and option arguments in their own arrays
var projectName = args[0];
var projectDir = [process.cwd(), projectName].join('/');
args = args.slice(1);

var packageArgs = new Array();
var optionArgs = {
	noReadme: false,
	noPkg: false
};

var pushPackage = false;
var pushOption = false;

args.forEach(function(value, index, arr) {
	switch (value) {
		case '-i':
			pushOption = false;
			pushPackage = true;
			break;
		case '-o':
			pushPackage = false;
			pushOption = true;
			break;
		default:
			if (pushPackage) {
				packageArgs.push(value);
				break;
			} else if (pushOption) {
				optionArgs[value] = true;
				break;
			}
			break;
	}
});

/***************************************
 * Let's grab some info first so we can
 * safely roll back if anything goes
 * wrong. We're dealing with an
 * asynchronus language here, so we can't
 * count on everything running in written
 * order.
 * You'll see a common pattern with error
 * checks after calling shell commands or
 * any filesystem operations. We could
 * just use the same pattern to call a
 * bunch of other functions in each
 * callback, but then we shouldn't work
 * against the nature of node.
 ***************************************/

var rollBackDir = ''

bash.run('pwd', bash.onStderr, function(stdout) {
	if (stdout.length > 0) {
		rollBackDir = stdout;
	}
});

var panicRoom = function() {
	console.log('rolling back...');
	bash.cd(rollbackDir, 'Emergency Rollback may have failed. Please check that the project directory was removed properly.')

	fs.rimdirSync(rollBackDir + '/' + projectName, function(err) {
		console.log('ERROR ' + err);
		console.log('WARNING: Emergency Rollback may have failed. Please check that the project directory was removed properly.');
		process.exit(1);
	});
	
	console.log('done rolling back');
	process.exit(1);
}

/****************************************
 * Default Config
 ****************************************/

var DefaultConfig = function(noPkg) {
	this.dirs = [{
		name: ".temp",
		childDirs: []
	}, {
		name: "client",
		childDirs: [{
			name: "compatiblity",
			childDirs: []
		}, {
			name: "templates",
			childDirs: []
		}, {
			name: "stylesheets",
			childDirs: []
		}, {
			name: "controllers",
			childDirs: []
		}, {
			name: "subscriptions",
			childDirs: []
		}]
	}, {
		name: "public",
		childDirs: [{
			name: "images",
			childDirs: []
		}]
	}, {
		name: "server",
		childDirs: [{
			name: "publications",
			childDirs: []
		}]
	}, {
		name: "private",
		childDirs: []
	}, {
		name: "lib",
		childDirs: [{
			name: "collections",
			childDirs: []
		}]
	}, {
		name: "tests",
		childDirs: []
	}];

	if (!noPkg) {
		this.packages = [
			"accounts-base",
			"accounts-password",
			"iron-router",
			"scss",
			"http"
		];
	} else
		this.packages = [];
}

/****************************************
 * Setting up some event listeners to
 * know when to go to the next step for
 * all of our bash commands and other
 * asynchronous operations
 ****************************************/

var config = new DefaultConfig(optionArgs.noPkg);
config.packages = config.packages.concat(packageArgs);

process.on('kickOff', function() {
	checkMeteor();
});

process.on('checkMeteorDone', function() {
	checkMeteorite();
});

process.on('checkMeteoriteDone', function() {
	createProject(projectName);
});

process.on('createProjectDone', function() {
	installPackages(projectDir, config.packages);
});

process.on('installPackagesDone', function(){
	scaffoldDirs(config.dirs);
});

process.on('scaffoldDirsDone', function(){
	console.log('project created successfully');
	process.exit(0);
});



/****************************************
 * Step 1:
 * check to make sure we have Meteor
 * installed
 ****************************************/
var chars = ['|', '/', '-', '\\'];
var charIndex = 0;

setInterval(function() {
	var outString = 'running ' + chars[charIndex % 4] + '\r';
	process.stdout.write(outString);
	charIndex++;
}, 100);



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

/****************************************
 * Step 2:
 * check to make sure we have meteorite
 * installed
 ****************************************/

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

/***************************************
 * Step 3:
 * Create the project and scaffold it
 * out. This consists of 3 parts:
 *
 * 1) Create the project using the mrt
 * utility.
 *
 * 2) Install all necessary packages
 * also using the mrt utility
 *
 * 3) Create the directory structure
 *
 * May want to extend this in the future
 * to allow for startkits and such
 ***************************************/

var createProject = function(name) {
	bash.run('mrt create ' + name, function(stderr) {
		if (stderr.length > 0) {
			if (stderr.indexOf(name + ': created') === -1) {
				console.log("ERROR: " + stderr);
				panicRoom();
			} else
				process.emit('createProjectDone');

		} else
			process.emit('createProjectDone');
	});
}

var installPackages = function(projectDir, packages) {
	bash.cd(projectDir);
	console.log('installing packages');
	packages.forEach(function(value, index, arr) {
		console.log('installing ' + value);
		bash.run('mrt add ' + value, undefined, function(stdout) {
			if (stdout.length === 0) {
				console.log('ERROR: The package named ' + value + ' does not exist anywhere.');
				panicRoom();
			}
		});
	});
	process.emit('installPackagesDone');
}

// function to recursively write directories
var createDir = function(dir) {
	if (!dir.name) {
		console.log('ERROR: missing directory name under path ' + parentPath);
		panicRoom();
	}

	fs.mkdirSync(dir.name, function(err) {
		console.log('ERROR: ' + err);
		panicRoom();
	});

	bash.cd(dir.name);

	dir.childDirs.forEach(function(value, index, arr) {
		createDir(value);
	});

	bash.cd('..');
}

var scaffoldDirs = function(dirs) {
	console.log('creating directories');
	bash.cd(projectDir);
	dirs.forEach(function(value, index, arr) {
		console.log('creating dir ' + value.name);
		createDir(value);
	});
	process.emit('scaffoldDirsDone');
}

/****************************************
 * Kicking off the script here
 ****************************************/

process.emit('kickOff');
