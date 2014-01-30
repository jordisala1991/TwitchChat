module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['public/js/*.js'],
                dest: 'public/js/dest/script.js'
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
                banner: '/*! script <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'public/js/dest/script.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        watch: {
            css: {
                files: 'public/js/*.js',
                tasks: ['uglify', 'concat']
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