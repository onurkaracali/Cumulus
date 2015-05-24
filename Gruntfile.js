'use strict';

var packageJson = require('./package.json')

module.exports = function(grunt) {

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-electron');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: {
      dev  : { 'NODE_ENV' : 'development' },
      dist : { 'NODE_ENV' : 'production' }
    },
    clean: {
      dist: ['dist/*'],
    },
    browserify: {
      options: {
        transform: ['reactify', 'envify']
      },
      dev: {
        options: {
          debug: true,
          alias: ['react:']  // Make React available externally for dev tools
        },
        src: ['app/js/app.js'],
        dest: 'app/js/bundle.js'
      },
      dist: {
        options: {
          debug: false,
        },
        src: '<%= browserify.dev.src %>',
        dest: 'app/js/bundle.js'
      }
    },
    sass: {
      dev: {
        options: { outputStyle: 'expanded' },
        files: {
          'app/css/app.css': 'app/scss/app.scss'
        }
      },
      dist: {
        options: { outputStyle: 'compressed' },
        files: {
          'app/css/app.css': 'app/scss/app.scss'
        }
      }
    },
    watch: {
      scripts: {
        files: ['app/js/**/*.js', '!app/js/bundle.js'],
        tasks: ['browserify:dev']
      },
      sass: {
        files: ['app/scss/**/*.scss'],
        tasks: ['sass:dev']
      }
    },
    electron: {
      osx: {
        options: {
          name            : 'Cumulus',
          dir             : '.',
          out             : 'dist',
          version         : '0.26.1',
          platform        : 'darwin',
          arch            : 'x64',
          'app-version'   : packageJson.version,
          'app-bundle-id' : 'be.gillesdemey.cumulus'
        }
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['env:dev' ,'browserify:dev', 'sass:dev', 'watch']);
  grunt.registerTask('build',   ['env:dist', 'clean:dist', 'browserify:dist', 'sass:dist', 'electron']);
};