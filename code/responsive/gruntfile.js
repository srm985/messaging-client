module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks 
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-newer');

    grunt.initConfig({
        clean: {
            files: [
                'web/**/*'
            ]
        },
        copy: {
            main: {
                files: [
                    { expand: true, cwd: 'src/font-icons/css/', src: '**/*', dest: 'web/font-icons/css/' },
                    { expand: true, cwd: 'src/font-icons/fonts/', src: '**/*', dest: 'web/font-icons/fonts/' },
                    { expand: true, cwd: 'src/media/', src: '**/*', dest: 'web/media/' },
                    { expand: true, cwd: 'src/js/', src: 'jquery-mobile.js', dest: 'web/js/' },
                ]
            }
        },
        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')({ browsers: ['last 100 versions'] })
                ]
            },
            dist: {
                expand: true,
                cwd: 'src/css',
                src: 'emessaging.css',
                dest: 'web/css/'
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'web/css',
                    src: 'emessaging.css',
                    dest: 'web/css/'
                }]
            }
        },
        uglify: {
            options: {
                compress: true,
                mangle: true
            },
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'src/js',
                    src: '**/*.js',
                    dest: 'web/js/'
                }]
            }
        },
        minifyHtml: {
            options: {
                cdata: true
            },
            dist: {
                files: {
                    'web/emessaging.htm': 'src/emessaging.htm'
                }
            }
        }
    });

    grunt.registerTask('default', ['clean', 'copy', 'postcss', 'cssmin', 'uglify', 'minifyHtml']);
};
