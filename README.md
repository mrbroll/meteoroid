**Meteoroid** is a command line utility for [Meteor](https://www.meteor.com) and extension for [Meteorite](https://github.com/oortcloud/meteorite).
It is designed to quickly scaffold out meteor projects and provide a command line interface for quickly creating commonly used components like controllers and templates.

Meteoroid is still in development. I don't have a whole lot of experience with Meteor, so the base usage may change. New features will be added as I get to know Meteor on a deeper level. 

###Installation
```npm install -g meteoroid```

_Note that if you do not have ownership over your global node_modules directory, you will get errors when trying to install:_
**DO NOT USE** ```sudo npm install -g meteoroid```
Using sudo for package management is not the greatest idea.
Run this once instead:
```sudo chown -R $USER /usr/local```

###Usage
```mrtd [projectname] [config] [-i [packages]] [-o [options]]```

_projectname_
This is just the name of your project. The generated project will be scaffolded using the default Meteoroid config.

_config_
You can optionally specify a different config.
Right now the config must be part of the project and exported from assets/configs/index.js.
There will be a way to easily publish configs in the future, but for now, just enter them manually.

The format is as follows:
```
	{
		name: "project_name",
		dirs: [{
			name: "directory_name",
			childDirs: [{
				name: "child_directory_name",
				childDirs: []
			}]
		},{
			name: "another_directory_name",
			childDirs: []
		}],
		packages: [
			"packge1",
			"packge2",
			"packge3"
		]
	}
```

_-i [packages] : Install Atmosphere Packages_
This is a space-separated list of atmosphere packages to be installed initially.

_-o [options] : Meteoroid Scaffolding Options_
This is a space-separated list of options, which include:
+ **no-pkg:**
    + This will not install any of the default Meteoroid packages. It will only install the same packages as _mrt create_ or _meteor create_.

_More options will be available as this project progresses._

**Component Generators**

```mrtd controller [controllername]```
Creates a javscript controller file for a handlebars template of the same name using a default controller template file.
_The ability to create, submit, and specify other controller template files will be added later._

```mrtd template [templatename]```
Creates a handlebars template using a default handlebars template file.
_The ability to create, submit, and specify other template files will be added later._

###Notes
When creating projects, anything after an -i flag will be interpreted as a package and anything after an -o flag will be interpreted as an option and ordering of packages and options does not matter.
Ex: ```mrtd new_project -i package1 -o option1 -i package2 -i package3 -o option2 option3```
is the same as: ```mrtd new_project -i package1 package2 package3 -o option1 option2 option3```

All options and packages specified will be ignored when specifying a config.

Package names are those used by [Atmosphere](https://www.atmospherejs.com). Use empty brackets _[]_ for the _packages_ member of the config to not install any additional packages on project creation.

When creating scaffolding configs, directory structure can be nested as deep as you want. Use empty brackets _[]_ for the _childDirs_ member of bottom level directories.
