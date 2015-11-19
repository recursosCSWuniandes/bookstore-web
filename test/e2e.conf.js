exports.config = {
    allScriptsTimeout: 11000,
    specs: [
        'e2e/*.js'
    ],
    capabilities: {
        'browserName': 'firefox'
    },
    chromeOnly: true,
    baseUrl: 'http://localhost:9001/',
    framework: 'jasmine2',
    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};