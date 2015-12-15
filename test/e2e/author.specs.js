describe('Book Store E2E Testing', function () {
    
    var nameVarTest = 'Val' + Math.floor(Math.random() * 10000);

    beforeEach(function () {
        browser.addMockModule('ngCrudMock', function () {
            var mod = angular.module('ngCrudMock', ['ngMockE2E']);

            mod.constant('ngCrudMock.baseUrl', 'api');

            mod.value('ngCrudMock.mockRecords', {});

            mod.run(['$httpBackend', 'ngCrudMock.mockRecords', 'ngCrudMock.baseUrl', function ($httpBackend, mockRecords, baseUrl) {
                    function getQueryParams(url) {
                        var vars = {}, hash;
                        var hashes = url.slice(url.indexOf('?') + 1).split('&');
                        for (var i = 0; i < hashes.length; i++) {
                            hash = hashes[i].split('=');
                            vars[hash[0]] = hash[1];
                        }
                        return vars;
                    }

                    function getEntityName(req_url) {
                        var url = req_url.split("?")[0];
                        var baseRegex = new RegExp(baseUrl + "/");
                        var urlSuffix = url.split(baseRegex).pop();
                        return urlSuffix.split("/")[0];
                    }

                    function getRecords(url) {
                        var entity = getEntityName(url);
                        if (mockRecords[entity] === undefined) {
                            mockRecords[entity] = [];
                        }
                        return mockRecords[entity];
                    }

                    var queryParamsRegex = '(([?](\\w+=\\w+))([&](\\w+=\\w+))*)?$';
                    var collectionUrl = new RegExp(baseUrl + '/(\\w+)(/master)?' + queryParamsRegex);
                    var recordUrl = new RegExp(baseUrl + '/(\\w+)(/master)?/([0-9]+)' + queryParamsRegex);
                    var ignore_regexp = new RegExp('^((?!' + baseUrl + ').)*$');

                    $httpBackend.whenGET(ignore_regexp).passThrough();
                    $httpBackend.whenGET(collectionUrl).respond(function (method, url) {
                        var records = getRecords(url);
                        var responseObj = [];
                        var queryParams = getQueryParams(url);
                        var page = queryParams.page;
                        var maxRecords = queryParams.maxRecords;
                        var headers = {};
                        if (page && maxRecords) {
                            var start_index = (page - 1) * maxRecords;
                            var end_index = start_index + maxRecords;
                            responseObj = records.slice(start_index, end_index);
                            headers = {"X-Total-Count": records.length};
                        } else {
                            responseObj = records;
                        }
                        return [200, responseObj, headers];
                    });
                    $httpBackend.whenGET(recordUrl).respond(function (method, url) {
                        var records = getRecords(url);
                        var id = parseInt(url.split('/').pop());
                        var record;
                        angular.forEach(records, function (value) {
                            if (value.id === id) {
                                record = angular.copy(value);
                            }
                        });
                        return [200, record, {}];
                    });
                    $httpBackend.whenPOST(collectionUrl).respond(function (method, url, data) {
                        var records = getRecords(url);
                        var record = angular.fromJson(data);
                        record.id = Math.floor(Math.random() * 10000);
                        records.push(record);
                        return [201, record, {}];
                    });
                    $httpBackend.whenPUT(recordUrl).respond(function (method, url, data) {
                        var records = getRecords(url);
                        var record = angular.fromJson(data);
                        angular.forEach(records, function (value, key) {
                            if (value.id === record.id) {
                                records.splice(key, 1, record);
                            }
                        });
                        return [200, null, {}];
                    });
                    $httpBackend.whenDELETE(recordUrl).respond(function (method, url) {
                        var records = getRecords(url);
                        var id = parseInt(url.split('/').pop());
                        angular.forEach(records, function (value, key) {
                            if (value.id === id) {
                                records.splice(key, 1);
                            }
                        });
                        return [204, null, {}];
                    });
                }]);
        });
    });

    it('should create one author', function () {
        browser.get('#/author');
        element(by.id('create-author')).click();
        element(by.id('name')).sendKeys(nameVarTest);
        element(by.id('save-author')).click();
        expect(element.all(by.repeater('record in records')).count()).toEqual(1);
    });
    
    it('should read one author', function () {
        expect(element(by.id('0-name')).getText()).toBe(nameVarTest);
    });
    
    it('should edit one author', function () {
        element(by.id('0-edit-btn')).click();
        element(by.id('name')).clear().sendKeys('New' + nameVarTest);
        element(by.id('save-author')).click();
        expect(element(by.id('0-name')).getText()).toBe('New' + nameVarTest);
    });
    
    it('should delete the author', function () {
        element(by.id('0-delete-btn')).click();
        expect(element.all(by.id('0-name')).count()).toEqual(0);
    });
});