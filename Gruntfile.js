var package = require('./package.json');

module.exports = function(grunt){
  	
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/* <%= pkg.name %> - v<%= pkg.version %> - <%= pkg.homepage %> <%= grunt.template.today("mm/dd/yyyy hh:mm TT") %> */'
    },
    jshint: {
      options: {
        browser: true
      }, 
      all: ['src/**/*.js']
    },
    requirejs: {
      compile: {
        options: {
          name: "src/bess.js",
          optimize: "uglify2",
          baseUrl: "./",
          mainConfigFile: "src/bess.js",
          out: "dist/" + package.name + "-" + package.version  + "-min.js"
        }
      }, 
      beautify: {
        options: {
          	name: "src/bess.js",
          	baseUrl: "./",
          	mainConfigFile: "src/bess.js",
          	out: "dist/" + package.name + "-" + package.version  + ".js",
			uglify: {
				beautify: true
			}
		} 
      }
    },
    qunit: {
        options: {
    		timeout: 20000
    	},
        all: ["http://localhost:8000/test/all.html"]
    },
    connect: {
		server: {
		  port: 8000,
		  base: "."
		}
	}
  });

  // This plugin provides the "connect" task.
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-qunit");
    
  grunt.registerTask("test", ["connect", "qunit"]);

  grunt.registerTask("default", ["jshint", "test", "requirejs"]);

};