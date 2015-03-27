'use strict';

module.exports = function (grunt) {
  var BANNER = '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
    '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
    '* Copyright (c) <%= grunt.template.today("yyyy") %> FocusVision ' +
    'Worldwide; Licensed <%= pkg.license %> */';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    eslint: {
      main: '<%= pkg.main %>',
      options: {
        configFile: '.eslintrc'
      },
      test: {
        files: 'test/**/*.js',
        options: {
          configFile: 'test/.eslintrc'
        }
      },
      tasks: 'Gruntfile.js'
    },

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
        commitFiles: [
          'package.json',
          'bower.json',
          'types.js',
          'types.min.js',
          'types.min.js.map'
        ],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
      }
    },

    uglify: {
      options: {
        banner: BANNER,
        sourceMap: true
      },
      dist: {
        src: 'types.js',
        dest: 'types.min.js'
      }
    },

    devUpdate: {
      main: {
        options: {
          updateType: 'prompt',
          semver: false
        }
      }
    },

    browserify: {
      options: {
        banner: BANNER,
        transform: [
          ['exposify', {
            expose: {
              angular: 'angular'
            }
          }]
        ]
      },
      main: {
        files: {
          'types.js': '<%= pkg.main %>'
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test', ['eslint', 'mochacov:main', 'mochacov:lcov']);
  grunt.registerTask('html-cov', ['mochacov:html-cov']);

  grunt.registerTask('release', function (target) {
    grunt.task.run('bump-only:' + target);
    grunt.task.run('build');
    grunt.task.run('bump-commit');
  });

  grunt.registerTask('build', ['browserify', 'uglify']);
  grunt.registerTask('default', ['test']);

};
