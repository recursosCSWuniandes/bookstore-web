exports.config = {
    allScriptsTimeout: 11000,
    specs: [
        'test/e2e/*.js'
    ],
    capabilities: {
        'browserName': 'firefox'
    },
    directConnect: true,
    baseUrl: 'http://localhost:9001/',
    framework: 'jasmine2',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};