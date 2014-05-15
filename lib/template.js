/****************************************
 * template.js
 * This contains all functionality for 
 * generating templates
 ****************************************/
var fs = require('fs');
var bash = require('./bash');
var defaultTemplate = require('../assets/templates/default_template');

exports.generate = function(args) {
	if (args < 1 || !/[\w-]+/.test(args[0])) {
		console.log('ERROR: You must specify a template name');
		process.exit(1);
	}
        defaultTemplate.content = defaultTemplate.content.replace(/@[\w-]+@/g, args[0]);

	if (!isMeteorProject()) {
		console.log('ERROR: You are not in a meteor project');
		process.exit(1);
	}

	// now we're in the root of the project, so let's switch to the controller's dir
	bash.cd('client/templates');
	if (args.length < 2) {
		fs.writeFileSync(args[0] + '.html', defaultTemplate.content, 'utf8');
		console.log('created template ' + args[0]);
	} else {
		writeTemplate(args[1]);
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

var writeTemplate = function(path) {
	if (path.length > 1) {
		fs.mkdirSync(string.join(process.cwd(), '/', path[0]));
		bash.cd(path[0]);
		writeTemplate(path.slice(1).join('/'));
		bash.cd('..');
	} else {
		fs.writeFileSync(path[0] + '.js', defaultTemplate.content, 'utf8');
		console.log('created controller ' + path[0]);
	}
}
