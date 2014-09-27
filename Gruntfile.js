'use strict';

module.exports = function (grunt) {
  var path = require('path');

  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      main: [
        'Gruntfile.js',
        '<%= pkg.main %>',
        '<%= mochacov.options.files %>'
      ],
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      }
    },

    // Unit tests.
    mochacov: {
      options: {
        files: 'test/*.spec.js'
      },
      main: {
        options: {
          reporter: 'spec'
        }
      },
      lcov: {
        options: {
          reporter: 'mocha-lcov-reporter',
          quiet: true,
          instrument: true,
          output: 'coverage/lcov.info'
        }
      },
      'html-cov': {
        options: {
          reporter: 'html-cov',
          output: 'coverage/index.html'
        }
      }
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'bower.json', 'types.min.js', 'types.min.js.map'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
          '* Copyright (c) <%= grunt.template.today("yyyy") %> Decipher, Inc.;' +
          ' Licensed <%= pkg.license %> */',
        sourceMap: true
      },
      dist: {
        src: '<%= pkg.main %>',
        dest: 'types.min.js'
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test', ['jshint', 'mochacov:main', 'mochacov:lcov']);
  grunt.registerTask('html-cov', ['mochacov:html-cov']);

  grunt.registerTask('release', function(target) {
    grunt.task.run('bump-only:' + target);
    grunt.task.run('build');
    grunt.task.run('bump-commit');
  });

  grunt.registerTask('build', ['uglify']);
  grunt.registerTask('default', ['test']);

};
