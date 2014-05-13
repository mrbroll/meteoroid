**Meteoroid** is a command line utility for [Meteor](https://www.meteor.com) and extension for [Meteorite](https://github.com/oortcloud/meteorite).
It is designed to quickly scaffold out meteor projects and provide a command line interface for quickly creating commonly used components like controllers and templates.

###Installation
```npm install -g meteoroid```

> _Note that if you need admin rights to install packages globally use:_
> ```sudo npm install -g meteoroid```

###Usage
```mrtd [projectname] [-i [packages]] [-o [options]]```
**Alternate:**
```mrtd [config].json```

**projectname**
This is just the name of your project. This will be the name of the containing folder.

**-i [packages] : Install Atmosphere Packages**
This is a space-separated list of atmosphere packages to be installed initially.

**-o [options] : Meteoroid Scaffolding Options**
This is a space-separated list of options, which include:
+ **no-pkg:**

	This will not install any of the default Meteoroid packages. It will only install the same packages as _mrt create_ or _meteor create_.

> _Note that anything after an -i flag will be interpreted as a package and anything after an -o flag will be interpreted as an option and ordering of packages and options does not matter._
>
> Ex: ```mrtd new_project -i package1 -o option1 -i package2 -i package3 -o option2 option3```
>
> is the same as: ```mrtd new_project -i package1 package2 package3 -o option1 option2 option3```

If you wish to specify a configuration file for scaffolding and packages, the format is as follows:
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
Directory structure can be nested as deep as you want. Use empty brackets _[]_ for the _childDirs_ member of bottom level directories.

Package names are those used by [Atmosphere](https://www.atmospherejs.com). Use empty brackets _[]_ for the _packages_ member of the config to not install any additional packages on project creation.

