module.exports = function(grunt){
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/* <%= pkg.name %> - v<%= pkg.version %> - <%= pkg.homepage %> <%= grunt.template.today("mm/dd/yyyy hh:mm TT") %> */'
    },
    lint: {
      all: ['src/**/*.js']
    },
    jshint: {
      options: {
        browser: true
      }
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
    min: {
      bess: {
        src: ["<banner>", "dist/<%=pkg.name%>-<%=pkg.version%>.js"],
        dest: "dist/<%=pkg.name%>-<%=pkg.version%>.min.js"
      }
    },
    qunit: {
      all: ["http://localhost:8000/test/all.html"]
    },
    server: {
      port: 8000,
      base: "."
    }
  });

  grunt.registerTask("test", "server qunit");

  grunt.registerTask("default", "lint requirejs min test");

};