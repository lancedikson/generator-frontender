// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // configurable paths
        yeoman: {
            app: 'app',
            dist: 'dist'
        },
        watch: {<% if (sass) { %>
            sass: {
                files: ['<%%= yeoman.app %>/scss/{,*/}*.{scss,sass}'<% if (framework == 'foundation') { %>, '<%%= yeoman.app %>/bower_components/foundation/scss/{,*/}*.{scss,sass}'<% } %>],
                tasks: ['sass:server'<% if (autoprefixer) { %>, 'autoprefixer'<% } %>]
            },<% } %>
            livereload: {
                options: {
                    livereload: '<%%= connect.options.livereload %>'
                },
                files: [
                    '<%%= yeoman.app %>/*.html',
                    '<%%= yeoman.app %>/css/{,*/}*.css',
                    '{.tmp,<%%= yeoman.app %>}/js/{,*/}*.js',
                    '<%%= yeoman.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%%= yeoman.dist %>'
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%%= yeoman.dist %>/*',
                        '!<%%= yeoman.dist %>/.git*'
                    ]
                }]
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%%= yeoman.app %>/js/{,*/}*.js',
                '!<%%= yeoman.app %>/js/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },<% if (sass) { %>
        sass: {
            options: {
                includePaths: [<% if (framework == 'foundation') { %>'<%%= yeoman.app %>/bower_components/foundation/scss' <% } %>]
            },
            dist: {
                options: {
                    outputStyle: 'compressed'
                },
                files: {
                    '<%= yeoman.app %>/css/main.css': '<%%= yeoman.app %>/scss/main.scss'
                }
            },
            server: {
                options: {
                    outputStyle: 'nested',
                    sourceComments: 'normal'
                },
                files: {
                    '<%= yeoman.app %>/css/main.css': '<%%= yeoman.app %>/scss/main.scss'
                }     
            }
        },<% } %><% if (autoprefixer) { %>
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/css/',
                    src: '{,*/}*.css',
                    dest: '<%= yeoman.app %>/css/'
                }]
            }
        },<% } %>
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>/img',
                    src: '{,*/}*.svg',
                    dest: '<%%= yeoman.dist %>/img'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.dist %>',
                    src: '{,*/}*.html',
                    dest: '<%%= yeoman.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%%= yeoman.app %>',
                    dest: '<%%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '{,*/}*.html',
                        'img/{,*/}*.{webp,gif,png,jpg}',
                        'fonts/{,*/}*.*'<% if (framework == 'bootstrap' && sass) { %>,
                        'bower_components/sass-bootstrap/fonts/*.*'<% } %>
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%%= yeoman.app %>/css',
                dest: '.tmp/css/',
                src: '{,*/}*.css'
            }
        },<% if (modernizr) { %>
        modernizr: {
            devFile: '<%%= yeoman.app %>/bower_components/modernizr/modernizr.js',
            outputFile: '<%%= yeoman.dist %>/bower_components/modernizr/modernizr.js',
            // extra : {
            //     "shiv" : true,
            //     "printshiv" : false,
            //     "load" : true,
            //     "mq" : false,
            //     "cssclasses" : true
            // },
            files: [
                '<%%= yeoman.dist %>/js/{,*/}*.js',
                '<%%= yeoman.dist %>/css/{,*/}*.css',
                '!<%%= yeoman.dist %>/js/vendor/*'
            ],
            uglify: true
        },<% } %>
        concurrent: {
            dist:[<% if (sass) { %>
                'sass:dist',<% } %>
                'copy:styles',
                'svgmin'
            ]
        }
    });

    grunt.registerTask('server', function (target) {
        grunt.task.run([<% if (sass) { %>
            'sass',<% } %><% if (autoprefixer) { %>
            'autoprefixer',<% } %>
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'concurrent:dist',<% if (autoprefixer) { %>
        'autoprefixer',<% } %>
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',<% if (modernizr) { %>
        'modernizr',<% } %>
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'build'
    ]);
};
