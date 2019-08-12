const sinon = require('sinon');
const fs = require('fs');
const expect = require('chai').expect;
const request = require('request-promise-native');
const divTestHarness = require('../index.js');

describe('index.js', function () {
    beforeEach(function () {
        sinon.stub(request, 'post').resolves({ id: '123' });
    });

    afterEach(function () {
        request.post.restore();
    });

    it('should create a DN case', function () {
        const proxy = '';
        const params = {
            baseUrl: '',
            authToken: '',
            caseData: fs.readFileSync('test/test.json')
        };
        return divTestHarness.createDnCase(params, proxy)
            .then(() => {
                expect(request.post.callCount).to.equal(2);
            });
    });

    it('should create a AOS case', function () {
        const proxy = '';
        const params = {
            baseUrl: '',
            authToken: '',
            caseData: fs.readFileSync('test/test.json')
        };
        return divTestHarness.createAosCase(params, proxy)
            .then(() => {
                expect(request.post.callCount).to.equal(2);
            });
    });

    it('should create a DA case', function () {
        const proxy = '';
        const params = {
            baseUrl: '',
            authToken: '',
            caseData: fs.readFileSync('test/test.json')
        };
        return divTestHarness.createDaCase(params, proxy)
            .then(() => {
                expect(request.post.callCount).to.equal(2);
            });
    });

    it('should create a DARequested case', function () {
        const proxy = '';
        const params = {
            baseUrl: '',
            authToken: '',
            caseData: fs.readFileSync('test/test.json')
        };
        return divTestHarness.createDaCaseInDaRequested(params, proxy)
        .then(() => {
            expect(request.post.callCount).to.equal(2);
        });
    });
});
