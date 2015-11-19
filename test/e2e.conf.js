exports.config = {
    allScriptsTimeout: 11000,
    specs: [
        'e2e/*.js'
    ],
    capabilities: {
        'browserName': 'firefox'
    },
    baseUrl: 'http://localhost:9001/',
    framework: 'jasmine2',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};