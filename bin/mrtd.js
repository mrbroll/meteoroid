#!/usr/bin/env node

/****************************************
 * Use this script to scaffold out a new
 * meteor application, and install meteor,
 * and meteorite if not already
 *
 * Note: This script requires node and
 * npm to be installed and in your path
 ****************************************/
var generator = require('../lib/generator');
var controller = require('../lib/controller');

// Set up our cool running text animation
var chars = ['|', '/', '-', '\\'];
var charIndex = 0;

setInterval(function() {
	var outString = 'running ' + chars[charIndex % 4] + '\r';
	process.stdout.write(outString);
	charIndex++;
}, 100);

var args = process.argv.slice(2);

if (!args || args.length === 0){
	console.log('Going to display some help text here at some point');
	process.exit(0);
}

switch(args[0]){
	case 'controller':
		controller.generate(args.slice(1));
		break;
	case 'template':
		//template.generate(args.slice(1));
		break;
	default:
		generator.generate(args);
		break;
}