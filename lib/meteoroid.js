/****************************************
 * meteoroid.js
 * This module is for internal use of
 * meteoroid to build out a config object
 * based on command line arguments or a
 * specified config.json file
 ****************************************/
var fs = require('fs');
var configs = require('../assets/configs/');
var defaultConfig = configs.default;

Meteoroid = function(args, fromconfig) {
	if (args.length < 1) {
		console.log("Dude, give your project a name at least.");
		process.exit(1);
	}

	if (!args.every(function(value, index) {
		return /^[\w-]+$/.test(value);
	})) {
		console.log("Use only alphanumerics, hyphens, and underscores");
		process.exit(1);
	}

	var projectName = args[0];
    var config;

    if (fromconfig) {
        if (args.length > 1)
            config = configs[args[1]];
        else
            config = configs[args[0]];

        if (config) {
            if (args.length > 1)
                config.name = projectName;
            return config;
        } else {
            console.log('ERROR: The config you specified does not exist');
            process.exit(1);
        }
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
