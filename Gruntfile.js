module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> \n * https://github.com/writethesky \n * https://github.com/writethesky/application.js \n * \n * Copyright (c) 2017 <%= pkg.author %>（<%= pkg.alias %>） \n * Released under the MIT License. \n * \n * Date: <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: true,
        sourceMapName: 'dist/<%= pkg.nameAlias %>.min.map'
      },
      build: {
        src: 'src/<%= pkg.name %>',
        dest: 'dist/<%= pkg.nameAlias %>.min.js'
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path 
          {
            expand: true, 
            flatten: true, 
            src: 'src/<%= pkg.name %>', 
            dest: 'dist/'
          },
        ],
      },
    },
  });

  // 加载包含 "uglify" 任务的插件。
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // 默认被执行的任务列表。
  grunt.registerTask('default', ['copy', 'uglify']);

};