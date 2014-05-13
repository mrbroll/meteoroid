/***************************************
 * rollback.js
 * This will a rollback point and
 * function for safely rolling back to 
 * said point in the event of an error
 * when generating a new project.
 ***************************************/
var fs = require('fs');
var bash = require('./bash');

var RollBack = function(dir, projectName) {
	if (!dir || !projectName)
		console.log('ERROR: Unable to set up rollback');

	this.panic = function() {
		console.log('rolling back...');
		bash.cd(dir, 'Emergency Rollback may have failed. Please check that the project directory was removed properly.')

		fs.rimdirSync(dir + '/' + projectName, function(err) {
			console.log('ERROR ' + err);
			console.log('WARNING: Emergency Rollback may have failed. Please check that the project directory was removed properly.');
			process.exit(1);
		});

		console.log('done rolling back');
		process.exit(1);
	}
}

module.exports = RollBack;