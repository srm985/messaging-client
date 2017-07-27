module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks 
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-newer');

    grunt.initConfig({
        clean: {
            files: [
                'web/**/*', '!web/media/**'
            ]
        },
        copy: {
            main: {
                files: [
                    { expand: true, cwd: 'src/font-icons/css/', src: '**/*', dest: 'web/font-icons/css/' },
                    { expand: true, cwd: 'src/font-icons/fonts/', src: '**/*', dest: 'web/font-icons/fonts/' },
                    { expand: true, cwd: 'src/media/', src: '**/*', dest: 'web/media/' },
                ]
            }
        },
        minifyHtml: {
            options: {
                cdata: true
            },
            dist: {
                files: {
                    'web/emessaging.htm': 'src/emessaging.htm',
                }
            }
        },
        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')({ browsers: ['last 15 versions'] })
                ]
            },
            dist: {
                expand: true,
                cwd: 'src/css/',
                src: '*.css',
                dest: 'src/css/prefixed-css/'
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/css/prefixed-css/',
                    src: '**/*.css',
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
                    cwd: 'src/js/',
                    src: '**/*.js',
                    dest: 'web/js/'
                }]
            }
        },
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 7
                },
                files: [{
                    expand: true,
                    cwd: 'src/media',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'web/media/'
                }]
            }
        }
    });

    grunt.registerTask('default', ['clean', 'copy', 'minifyHtml', 'postcss', 'cssmin', 'uglify']);
    grunt.registerTask('prefixcss', 'postcss');
    grunt.registerTask('compress-images', 'newer:imagemin');
    grunt.registerTask('run-all', ['clean', 'copy', 'minifyHtml', 'cssmin', 'uglify', 'newer:imagemin']);
};
