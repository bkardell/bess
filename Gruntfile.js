module.exports = function(grunt){
  'use strict';
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['src/**/*.js'],
      options: {
        evil: true
      }
    },

    concat: {
      dist: {
        src: [
          'src/bess.js',
          'src/parser.js',
          'src/scanner.js',
          'src/engine.js',
          'src/resolver.js',
          'src/modules.js',
          'src/utility.js'
        ],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
      },
      core: {
        src: [
          'src/modules/class.js',
          'src/modules/effect.js'
        ],
        dest: 'dist/<%= pkg.name %>-core-modules-<%= pkg.version %>.js'
      }
    },

    uglify: {
      dist: {
        src: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      },
      core: {
        src: 'dist/<%= pkg.name %>-core-modules-<%= pkg.version %>.js',
        dest: 'dist/<%= pkg.name %>-core-modules-<%= pkg.version %>.min.js'
      }
    },

    qunit: {
      options: {
        timeout: 1000
      },
      all: {
        options: {
          urls: ['http://localhost:8000/test/index.html']
        }
      }
    },

    connect: {
      server: {
        port: 8000,
        base: '.'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('test', ['connect', 'qunit']);
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};