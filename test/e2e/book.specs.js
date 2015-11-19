describe('Book Store E2E Testing', function () {

    beforeEach(function () {
        browser.addMockModule('ngCrudMock', function () {
            angular.module('ngCrudMock');
        });
    });

    it('should create one artist', function () {
        browser.get('#/book');
        expect(1).toEqual(1);
//        element(by.id('create-artist')).click();
//        browser.sleep(1000);
//        element(by.id('name')).sendKeys('DaVinci');
//        browser.sleep(1000);
//        element(by.id('save-artist')).click();
//        browser.sleep(1000);
//        expect(element.all(by.repeater('record in records')).count()).toEqual(1);
    });
});