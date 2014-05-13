/****************************************
 * config_builder.js
 * This module is for internal use of
 * meteoroid to build out a config object
 * based on command line arguments or a
 * specified config.json file
 ****************************************/
var fs = require('fs');
var defaultConfig = require('../assets/configs/default_config');

Meteoroid = function(args) {
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

	var config;

	var configs = args.filter(function(value) {
		return /^[\w-\/\s]+\.json$/.test(value);
	});

	if (configs && configs.length > 0) {
		configFile = configs[0];
		try {
			config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
		} catch (ex) {
			console.log('ERROR: ' + ex);
			process.exit(1);
		}
	}

	// get the project name
	var projectName;

	if (config && config.name) {
		return config;
	} else {
		projectName = args[0];
	}

	args = args.slice(1);

	// get all the package and option arguments in their own arrays
	var packageArgs = new Array();
	var optionArgs = {
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

	return new DefaultConfig(projectName, packageArgs, optionArgs);

}

/****************************************
 * Default Config - we'll use this if
 * there is no config.json specified on
 * the command line
 ****************************************/

var DefaultConfig = function(name, packages, options) {
	this.name = name;

	this.dirs = defaultConfig.dirs;

	this.packages = (function(opts, pkgs) {
		if (options && options.noPkg) {
			return [];
		} else {
			if (packages.length > 0) {
				return pkgs;
			} else {
				return defaultConfig.packages;
			}
		}
	})(options, packages);
}

module.exports = Meteoroid;