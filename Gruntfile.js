module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['public/js/components/functions.js',
                      'public/js/components/templating.js',
                      'public/js/components/emoticonhandler.js',
                      'public/js/components/chathandler.js',
                      'public/js/components/twitchchat.js',
                      'public/js/components/main.js'],

                dest: 'public/js/script.js'
            },
            vendor: {
                src: 'public/js/vendor/*.js',
                dest: 'public/js/vendor.js'
            }
        },
        cssmin: {
            add_banner: {
                options: {
                    banner: '/*! styles <%= grunt.template.today("dd-mm-yyyy") %> */\n'
                },
                files: {
                    'public/css/dest/styles.min.css': ['public/css/*.css']
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! script <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                compress: false
            },
            dist: {
                files: {
                    'public/js/script.min.js': ['<%= concat.dist.dest %>'],
                    'public/js/vendor.min.js': ['<%= concat.vendor.dest %>']
                }
            }
        },
        watch: {
            css: {
                files: 'public/js/*.js',
                tasks: ['concat', 'uglify']
            },
            js: {
                files: 'public/css/*.css',
                tasks: ['cssmin']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);
};
