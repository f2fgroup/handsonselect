module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkg,
    uglify: {
      dist: {
        options: {
          mangle: false,
          compress: false,
          beautify: true,
          preserveComments: 'all'
        },
        files: {
          'dist/handsonselect.js': [
            'src/editor.js',
            'src/renderer.js',
            'src/validator.js',
            'src/main.js',
            'bower_components/select2/dist/js/select2.full.js'
          ]
        }
      },
      build: {
        files: {
          'dist/handsonselect.min.js': 'dist/handsonselect.js'
        }
      }
    },
    cssmin: {
      target: {
        files: {
          'dist/handsonselect.min.css': ['bower_components/select2/dist/css/select2.css', 'src/style.css']
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/*.js', 'src/*.css'],
        tasks: ['test']
      }
    },
    jshint: {
      all: ['src/*.js']
    }
  });


  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('build', ['uglify:dist', 'uglify:build', 'cssmin']);
  grunt.registerTask('test', ['jshint', 'build']);

};
