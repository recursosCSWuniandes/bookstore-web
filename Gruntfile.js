module.exports = function (grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin',
        ngtemplates: 'grunt-angular-templates',
        protractor: 'grunt-protractor-runner',
        sonarRunner: 'grunt-sonar-runner'
    });

    var appConfig = {
        src: 'public_html',
        tmp: '.tmp',
        dist: 'dist',
        bower: 'bower_components',
        includeJsFiles: [
            'src/app.js',
            'src/**/*.mod.js',
            'src/**/*.js'
        ],
        includeCssFiles: [
            'src/**/*.css'
        ]};

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: appConfig,
        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= meta.dist %>/{,*/}*',
                            '!<%= meta.dist %>/.git{,*/}*'
                        ]
                    }]
            },
            server: '.tmp'
        },
        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                        expand: true,
                        dot: true,
                        cwd: '<%= meta.src %>',
                        dest: '<%= meta.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            '*.html',
                            'images/{,*/}*.{webp}',
                            'styles/fonts/{,*/}*.*'
                        ]
                    }, {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= meta.dist %>/images',
                        src: ['generated/*']
                    }, {
                        expand: true,
                        cwd: 'bower_components/bootstrap/dist',
                        src: 'fonts/*',
                        dest: '<%= meta.dist %>'
                    }]
            },
            styles: {
                expand: true,
                cwd: '<%= meta.src %>/styles',
                dest: '<%= meta.tmp %>/styles/',
                src: '{,*/}*.css'
            }
        },
        ngtemplates: {
            dist: {
                src: 'src/**/*.tpl.html',
                dest: '<%= meta.tmp %>/templateCache.js',
                cwd: '<%= meta.src %>',
                options: {
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeComments: true
                    },
                    module: 'mainApp',
                    usemin: 'scripts/scripts.js'
                }
            }
        },
        wiredep: {
            dist: {
                src: [
                    '<%= meta.src %>/**/*.html' // .html support...
                ]
            },
            test: {
                src: [
                    '<%= meta.src %>/**/*.html' // .html support...
                ],
                devDependencies: true
            }
        },
        includeSource: {
            options: {
                basePath: '<%= meta.src %>'
            },
            dist: {
                files: {
                    '<%= meta.src %>/index.html': '<%= meta.src %>/index.html'
                }
            }
        },
        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= meta.src %>/index.html',
            options: {
                dest: '<%= meta.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },
        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= meta.dist %>/{,*/}*.html'],
            options: {
                assetsDirs: [
                    '<%= meta.dist %>',
                    '<%= meta.dist %>/images',
                    '<%= meta.dist %>/styles'
                ],
                patterns: {
                    js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
                }
            }
        },
        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= meta.src %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            styles: {
                files: ['<%= meta.src %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= meta.src %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= meta.src %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect) {
                        return [
                            connect.static(appConfig.tmp),
                            connect().use(
                                    '/bower_components',
                                    connect.static('./bower_components')
                                    ),
                            connect().use(
                                    '/<%= meta.tmp %>src/styles',
                                    connect.static('./<%= meta.src %>/styles')
                                    ),
                            connect.static(appConfig.src)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            connect.static(appConfig.tmp),
                            connect.static('test'),
                            connect().use(
                                    '/bower_components',
                                    connect.static('./bower_components')
                                    ),
                            connect.static(appConfig.src)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= meta.dist %>'
                }
            }
        },
        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= meta.dist %>/scripts/{,*/}*.js',
                    '<%= meta.dist %>/styles/{,*/}*.css',
                    '<%= meta.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= meta.dist %>/styles/fonts/*'
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true
                },
                files: [{
                        expand: true,
                        cwd: '<%= meta.dist %>',
                        src: ['*.html'],
                        dest: '<%= meta.dist %>'
                    }]
            }
        },
        protractor: {
            test: {
                options: {
                    configFile: "test/e2e.conf.js"
                }
            }
        },
        sonarRunner: {
            analysis: {
                options: {
                    sonar: {
                        host: {
                            url: 'http://157.253.238.75:9000'
                        },
                        projectKey: '<%= pkg.name %>',
                        projectName: '<%= pkg.description %>',
                        projectVersion: '<%= pkg.version %>',
                        sources: '<%= meta.src %>',
                        sourceEncoding: 'UTF-8'
                    }
                }
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                curly: true,
                latedef: true,
                eqeqeq: true,
                eqnull: true,
                bitwise: true,
                browser: true,
                noarg: true,
                node: true,
                undef: true,
                unused: true,
                forin: true,
                evil: true,
                globals: {
                    angular: false
                }
            },
            src: {
                src: [
                    'Gruntfile.js',
                    '<%= meta.src %>/**/*.js'
                ]
            }
        }
    });

    grunt.registerTask('run', 'Compile then start a connect web server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'jshint',
            'clean:server',
            'wiredep',
            'includeSource',
            'copy:styles',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'jshint',
        'clean',
        'wiredep:dist',
        'includeSource',
        'useminPrepare',
        'ngtemplates',
        'concat',
        'copy',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('test', [
        'jshint',
        'clean:server',
        'wiredep:test',
        'includeSource',
        'copy:styles',
        'connect:test',
        'protractor'
    ]);

    grunt.registerTask('default', ['test', 'build']);
};