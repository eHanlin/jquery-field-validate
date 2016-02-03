
var path = require('path');

module.exports = function( grunt ) {

  require("matchdep").filterDev("grunt-*").forEach( grunt.loadNpmTasks );

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    src:"src",
    coffee:{
      glob_to_multiple: {
        expand: true,
        flatten: true,
        cwd: '<%= src %>/coffee/',
        src: ['*.coffee'],
        dest: '<%= src %>/js/',
        ext: '.js'
      }
    },
    connect: {
      server: {
        options: {
          port: 9000,
          base:"src"
        },
      },
    },
    watch: {
      options:{
        livereload: true
      },
      scripts: {
        files: ['**/*.coffee'],
        tasks: ['coffee']
      },
      html: {
        files: ['**/*.html']
      }
    },
    uglify: {
      build: {
        src: '<%= pkg.main %>.js',
        dest: '<%= pkg.main %>.min.js'
      }
    },
    open: { 
      server:{
        path: "http://localhost:<%= connect.server.options.port %>/index.html"
      }
    }
  });
   
   
  grunt.registerTask('build', ['uglify']);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('server', ['connect','open', 'watch']);

}

