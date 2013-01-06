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
          baseUrl: "./",
          mainConfigFile: "src/bess.js",
          out: "dist/bess.js"
        }
      }
    },
    uglify: {
    	options: {
    		beautify: true,
			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
					'<%= grunt.template.today("yyyy-mm-dd") %> */'
		},
		files: {
			"dist/<%=pkg.name%>-<%=pkg.version%>.js": ["dist/*.js"]
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
	
	grunt.event.on('qunit.spawn', function (url) {
	  grunt.log.ok("Running test: " + url);
	});
	
	grunt.event.on('qunit.begin', function (url) {
	  grunt.log.ok("begun");
	});
		grunt.event.on('qunit.teststart', function (name) {
	  grunt.log.ok("started " + name);
	});
  // This plugin provides the "connect" task.
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-qunit");
    
  grunt.registerTask("test", ["connect", "qunit"]);

  grunt.registerTask("default", ["jshint", "test"]);

};