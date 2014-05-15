/****************************************
 * controller.js
 * This contains all functionality for
 * generating controller logic files
 * for templates
 ****************************************/
var fs = require('fs');
var bash = require('./bash');
var defaultController = require('../assets/controllers/default_controller');

exports.generate = function(args) {
	if (args < 1 || !/[\w-]+/.test(args[0])) {
		console.log('ERROR: You must specify a controller name');
		process.exit(1);
	}
        defaultController.content = defaultController.content.replace(/@[\w-]+@/g, args[0]);

	if (!isMeteorProject()) {
		console.log('ERROR: You are not in a meteor project');
		process.exit(1);
	}

	// now we're in the root of the project, so let's switch to the controller's dir
	bash.cd('client/controllers');
	if (args.length < 2) {
		fs.writeFileSync(args[0] + '.js', defaultController.content, 'utf8');
		console.log('created controller ' + args[0]);
	} else {
		writeController(args[1]);
	}

	process.exit(0);
}

var isMeteorProject = function() {
	while (!/^\/users\/[\w-]+$/i.test(process.cwd())) {
		if (fs.existsSync('./.meteor'))
			return true;
		else
			bash.cd('..');
	}
	return false;
}

var writeController = function(path) {
	if (path.length > 1) {
		fs.mkdirSync(string.join(process.cwd(), '/', path[0]));
		bash.cd(path[0]);
		writeController(path.slice(1).join('/'));
		bash.cd('..');
	} else {
		fs.writeFileSync(path[0] + '.js', defaultController.content, 'utf8');
		console.log('created controller ' + path[0]);
	}
}
