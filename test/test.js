const sinon = require('sinon');
const expect  = require('chai').expect;
const request = require('request-promise-native');
const divTestHarness = require('../index.js');

describe('index.js', function () {
    beforeEach(function() {
        sinon.stub(request, 'post').returns({id: '123'});
      });
    
      afterEach(function() {
        request.post.restore();
      });
    
    it('should create a DN case', function (done) {

        const proxy = '';
        const params = {
            baseUrl: 'http://localhost:300',
            authToken: '',
            caseDataFilePath: 'test/test.json'
        }
        
        divTestHarness.createDnCase(params, proxy)
        .then(() => {
            expect(request.post.callCount).to.equal(2);
            done();
        })
        .catch(error => {
            done(error);
        });
    });
});